import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { AuthService } from "@app/services/auth.service";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { ResponseLogin } from "@app/interfaces/auth";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  private isRefreshing = false;

  constructor(public authServ: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authServ.getToken()) {
      request = this.addToken(request, this.authServ.getToken());
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          request.url.includes("refresh")
        ) {
          this.authServ.forceLogout;
        }
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !request.url.includes("login")
        ) {
          return this.handle401Error(request, next);
        }
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const tokenrf = this.authServ.getRefreshToken();

      if (tokenrf) {
        return this.authServ.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(this.authServ.getToken());
            return next.handle(
              this.addToken(request, this.authServ.getToken())
            );
          }),
          catchError((err) => {
            this.isRefreshing = false;
            this.authServ.forceLogout();
            return throwError(err);
          })
        );
      }
    }
    return this.refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((jwt) => {
        return next.handle(this.addToken(request, jwt));
      })
    );
  }
}
