import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Empleado } from "@app/interfaces/empleado";
import { Usuario } from "@app/interfaces/user";
import { EmpleadosService } from "@app/services/empleados.service";
import { UserService } from "@app/services/user.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input()
  headers: string[];
  @Input()
  datatype: string;

  @Output()
  accion = new EventEmitter<Map<string, Empleado>>();

  length = 0;
  dataSource: MatTableDataSource<Usuario | Empleado>;
  expandedElement: Usuario | Empleado;
  loading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private user_Servi: UserService,
    private employ_Serv: EmpleadosService
  ) {
    // Create 100 users
    // Assign the data to the data source for the table to render
  }
  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = `${this.datatype} por pagina`;
    if (this.dataSource != undefined) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  ngOnInit(): void {
    this.loading = true;
    switch (this.datatype) {
      case "clientes":
        this.user_Servi.getUsers().subscribe((res) => {
          this.dataSource = new MatTableDataSource(res.result as Usuario[]);
          this.length = (res.result as Usuario[]).length;
          this.loading = false;
        });
        break;
      case "empleados":
        this.employ_Serv.getEmployees().subscribe((res) => {
          this.dataSource = new MatTableDataSource(res.result as Empleado[]);
          this.length = (res.result as Empleado[]).length;
          this.loading = false;
        });
        break;

      default:
        break;
    }

    if (this.datatype == "clientes") {
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  borrar(value: Empleado) {
    const valor: Map<string, Empleado> = new Map();
    valor.set("delete", value);
    this.accion.emit(valor);
  }
  editar(value: Empleado) {
    const valor: Map<string, Empleado> = new Map();
    valor.set("editar", value);
    this.accion.emit(valor);
  }
}
