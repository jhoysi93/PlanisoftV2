import { Component, OnChanges } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Proyecto } from "../../../clases/Proyecto.interface";
import { FirebaseService } from "../../../services/firebase.service";
import { Tarea } from "../../../clases/Tarea";

@Component({
  selector: 'app-estadisticos',
  templateUrl: './estadisticos.component.html',
  styles: []
})
export class EstadisticosComponent implements OnChanges {
  idProyect: string;
  public proyecto: Proyecto;
  autoSkip1: boolean = false;
  public cantidadTotalTareas: number = 0;

  public cantidadTareasNoTerminadas: number = 0;
  public cantidadTareasTerminadas: number = 0;

  public cantidadTareasALtas: number = 0;
  public cantidadTareasBajas: number = 0;
  public cantidadTareasMedias: number = 0;

  //VARIABLES grafica redondo de tareas terminadas no terminadas  a medias
  public pieChartLabels: string[] = ['Tareas No Terminadas', 'Tareas Terminadas'];
  public pieChartData: number[] = [0, 0];
  public pieChartType: string = 'pie';

  //VARAIBLES PARA LA GRAFICA DONA QUE DONDE SE MUESTRA LAS PRIORIDADES DE LAS TAREAS
  public doughnutChartLabels: string[] = ['Priodidad Alta', 'Priodidad Baja', 'Prioridad Media'];
  public doughnutChartData: number[] = [0, 0, 0];
  public doughnutChartType: string = 'doughnut';


  ///VARIABLES PARA LA GRAFICA DE BARRAS porcentaje de avanze de las tareas
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;


  public barChartData: any[] = [
    { data: [], label: 'Tareas' }
  ];

  ngOnChanges() {

    this.barChartOptions = {
      scaleShowVerticalLines: false,
      responsive: true
    };
    this.barChartLabels = [];
    this.barChartType = 'bar';
    this.barChartLegend = true;
    this.barChartData = [
      { data: [], label: 'Tareas' }
    ];

  }


  constructor(private activatedRoute: ActivatedRoute, public firebaseService: FirebaseService) {
    activatedRoute.params.subscribe(id => {
      this.idProyect = id['id'];

      this.firebaseService.getProyecto(this.idProyect).subscribe((proyec) => {
        this.proyecto = proyec;
        if (this.proyecto.tareas) {

          this.cargarGraficaRTareasTerminadas(this.proyecto.tareas);
          this.cargarGraficaDPrioridadesTareas(this.proyecto.tareas);

          this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true
          };
          this.barChartLabels = [];
          this.barChartType = 'bar';
          this.barChartLegend = true;
          this.barChartData = [
            { data: [], label: 'Tareas' }
          ];

          this.cargarGraficaBAvanzeTareas(this.proyecto.tareas);

        } else {
          this.barChartOptions = {
            scaleShowVerticalLines: false,
            responsive: true
          };
          this.barChartLabels = [];
          this.barChartType = 'bar';
          this.barChartLegend = true;
          this.barChartData = [
            { data: [], label: 'Tareas' }
          ];

          this.pieChartLabels = ['Tareas No Terminadas', 'Tareas Terminadas'];
          this.pieChartData = [0, 0];
          this.pieChartType = 'pie';
          this.doughnutChartLabels = ['Priodidad Alta', 'Priodidad Baja', 'Prioridad Media'];
          this.doughnutChartData = [0, 0, 0];
          this.doughnutChartType = 'doughnut';


        this.cantidadTotalTareas = 0;
        this.cantidadTareasNoTerminadas = 0;
        this.cantidadTareasTerminadas = 0;
        this.cantidadTareasALtas = 0;
        this.cantidadTareasBajas = 0;
        this.cantidadTareasMedias = 0;
        }


      });
    });
  }

  //METODOS PARA CARGAR EL GRAFICO REDONDO de prioridades
  private cargarGraficaDPrioridadesTareas(tareas: Tarea[]) {
    let alta: number = 0;
    let media: number = 0;
    let baja: number = 0;
    let totalTareas: number = 0;

    for (var tareaKey in tareas) {

      let tareaAux: Tarea = tareas[tareaKey];
      console.log(tareaAux);

      if (tareaAux.prioridadTarea == "Alta") {

        alta++;
      } else if (tareaAux.prioridadTarea == "Media") {
        media++;
      } else {
        baja++;
      }

      totalTareas++;
    }

    this.cantidadTareasALtas = alta;
    this.cantidadTareasBajas = baja;
    this.cantidadTareasMedias = media;




    this.cantidadTotalTareas = totalTareas;
    let porcentAlta: number = (alta * 100) / totalTareas;

    let porcenMedia: number = (media * 100) / totalTareas;
    let porcenBaja: number = (baja * 100) / totalTareas;


    this.doughnutChartData = [Math.floor(porcentAlta), Math.floor(porcenBaja), Math.floor(porcenMedia)]
  }

  //METODOS PARA CARGAR EL GRAFICO REDONDO DE TAREAS TERMINADASY NO TERMINADAS
  private cargarGraficaRTareasTerminadas(tareas: Tarea[]) {
    let tareasTerminadas: number = 0;
    let tareasNoTerminadas: number = 0;
    console.log(tareas);
    let totalTareas: number = 0;

    for (var tareaKey in tareas) {

      let tareaAux: Tarea = tareas[tareaKey];
      console.log(tareaAux);

      if (tareaAux.avanzeTarea == 100) {

        tareasTerminadas++;
      } else if (tareaAux.avanzeTarea < 100) {
        tareasNoTerminadas++;
      }

      totalTareas++;
    }

    this.cantidadTareasNoTerminadas = tareasNoTerminadas;
    this.cantidadTareasTerminadas = tareasTerminadas;

    let porcentajeTareasTerminadas: number = (tareasTerminadas * 100) / totalTareas;

    let porcentajeTareasNoTerminadas: number = (tareasNoTerminadas * 100) / totalTareas;


    this.pieChartData = [Math.floor(porcentajeTareasNoTerminadas), Math.floor(porcentajeTareasTerminadas)]
  }

  // METODOS PARA LA GRAFICA DE BARRAS DE PORCENTAJE DE AVANZE DE LAS TAREAS
  private cargarGraficaBAvanzeTareas(tareas: Tarea[]) {
    let obj: any = {
      data: [],
      label: "Tareas"
    }

    for (let tareKey in tareas) {
      let tareaAux: Tarea = tareas[tareKey];
      //obj.data.push(tareaAux.avanzeTarea);
      this.barChartData[0].data.push(tareaAux.avanzeTarea);
      this.barChartLabels.push(tareaAux.nombreTarea);
    }
    //this.barChartData.push(obj);
    //this.barChartData.splice(0,1)


  }




}
