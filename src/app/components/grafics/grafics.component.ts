import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label , Color, monkeyPatchChartJsTooltip, monkeyPatchChartJsLegend, SingleDataSet, Colors } from 'ng2-charts';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-grafics',
  templateUrl: './grafics.component.html',
  styleUrls: ['./grafics.component.scss']
})
export class GraficsComponent implements OnInit {
  @Input() texts: string[] = ['performance','Estadisticas']
  
  @Input() datagrafics:Subject<Map<string,number>>  

  constructor() { 
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit(): void {
    
    this.labelsandData()
  }

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 4/4
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  public pieChartColors: Color[] = [
    {
      backgroundColor: ['rgb(84, 231, 162)','rgb(231, 84, 91)','rgb(238, 159, 68)','rgb(95, 116, 236)','aqua'],
      

    },    
  ];


  labelsandData(){
    if (this.datagrafics) {      
      this.datagrafics.subscribe(res=>{
        if (res.size>2) {
          const keys = Array.from(res.keys())
          const datas = Array.from(res.values())
          for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            this.pieChartLabels.push([element])         
          }
          this.pieChartData.push(datas)
       
        }

      
      
      })
    }
    

  }
}
