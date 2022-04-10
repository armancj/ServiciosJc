import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  CantPerStatus,
  CantPorMes,
  RequesByDate,
} from "@app/interfaces/interfaces";
import { Solicitud } from "@app/interfaces/solicitud";
import { SolicitudesService } from "@app/services/solicitudes.service";
import { stadosSolicitud } from "@app/variables/constantes";
import { TranslateService } from "@ngx-translate/core";
import {
  ChartColor,
  ChartData,
  ChartDataSets,
  ChartOptions,
  ChartType,
  Chart,
} from "chart.js";
import { Color, Colors, Label } from "ng2-charts";
import { Subject } from "rxjs";

export type _colores = {
  CREATED: { backgroundColor: "white" };
  PROCCESING: { backgroundColor: "rgb(84, 231, 162)" };
  DISPATCHED: { backgroundColor: "rgb(231, 84, 91)" };
  CLOSED: { backgroundColor: "grey" };
};

@Component({
  selector: "app-barras",
  templateUrl: "./barras.component.html",
  styleUrls: ["./barras.component.scss"],
})
export class BarrasComponent implements OnInit {
  @Input() texts: string[] = ["performance", "Estadisticas"];
  @Input() labels: Subject<Label[]>;
  @Input() datagrafics: Subject<Map<string, ChartDataSets>>;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  meses: Label[];

  public barChartColors: Color[] = [];
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [];

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.labelsandData();
  }

  labelsandData() {
    if (this.labels) {
      this.labels.subscribe((res) => {
        this.barChartLabels = res;
      });
    }

    if (this.datagrafics) {
      this.datagrafics.subscribe((res) => {
        this.barChartData = [];
        const datas = Array.from(res.values());
        this.barChartData = datas;
      });
    }
  }
}
