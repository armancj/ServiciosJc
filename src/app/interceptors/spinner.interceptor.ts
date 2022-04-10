import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpinnerService } from '@app/services/spinner.service';
import { finalize } from 'rxjs/operators';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
    constructor(private spinnerServ:SpinnerService){}
    intercept(req:HttpRequest<any>, next:HttpHandler):Observable<HttpEvent<any>>{
        this.spinnerServ.show()
        return next.handle(req).pipe(
            finalize(()=>this.spinnerServ.hide())
        )
    }

}