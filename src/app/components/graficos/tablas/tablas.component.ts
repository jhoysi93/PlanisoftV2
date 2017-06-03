import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FirebaseService } from "../../../services/firebase.service";
import { Tarea } from "../../../clases/Tarea";
import { Proyecto } from "../../../clases/Proyecto.interface";

@Component({
  selector: 'app-tablas',
  templateUrl: './tablas.component.html',
  styles: []
})
export class TablasComponent implements OnInit {
  idProyect: string;
  //proyecot
  listaTareas: Tarea[] = [];
  //termin no termin
  listaTerminadas: Tarea[] = [];
  listaNoTerminadas: Tarea[] = [];
  //prioridades
  listaPrioridadAlta: Tarea[] = [];
  listaPrioridadMedia: Tarea[] = [];
  listaPrioridadBaja: Tarea[] = [];
  //priori alta sin terminar
  listaNoTerminadasConPrioridadALta: Tarea[] = [];
  listaNoTerminadasConPrioridadMedia: Tarea[] = [];
  listaNoTerminadasConPrioridadBaja: Tarea[] = [];

  constructor(private activatedRoute: ActivatedRoute, private firebaseService: FirebaseService) {
    activatedRoute.params.subscribe(id => {

      this.idProyect = id['id'];

      this.cargarDatos(this.idProyect);

    });
  }
  ngOnInit() {
  }
  //titulo
  private titulo:string="";
  cargarDatos(idProyect) {
    this.firebaseService.getProyecto(idProyect).subscribe((data: Proyecto) => {
      this.listaTareas = data.tareas;
      this.titulo = data.nombre;
      console.log("listaTareas");
      console.log(data.tareas);
      this.cargarTareasTerminadas(this.listaTareas);
      this.cargarTareasConPrioridades(this.listaTareas);
      this.cargarTareasNoTerminadasConPrioridadALta(this.listaTareas);
    });
  }
  //metodo para cargar tareas terminadas y no terminadas
  cargarTareasTerminadas(listaTareas: Tarea[]) {

    for (var key in listaTareas) {
      if (listaTareas[key].avanzeTarea == 100) {

        this.listaTerminadas.push(listaTareas[key]);
      } else {
        this.listaNoTerminadas.push(listaTareas[key]);
      }
    }

  }
//caragar a las listas las tareas segun sus priodidades
  cargarTareasConPrioridades(listaTareas:Tarea[]){
    for (var key in listaTareas) {

      if (listaTareas[key].prioridadTarea == "Alta") {
        this.listaPrioridadAlta.push(listaTareas[key]);

      } else if(listaTareas[key].prioridadTarea == "Media"){
        this.listaPrioridadMedia.push(listaTareas[key]);

      }else{
        this.listaPrioridadBaja.push(listaTareas[key]);
      }

    }
  }

  cargarTareasNoTerminadasConPrioridadALta(listaTareas:Tarea[]){
    for (var key in listaTareas) {

      if (listaTareas[key].prioridadTarea == "Alta" && listaTareas[key].avanzeTarea != 100) {
        this.listaNoTerminadasConPrioridadALta.push(listaTareas[key]);

      }else if(listaTareas[key].prioridadTarea == "Media" && listaTareas[key].avanzeTarea != 100){
        this.listaNoTerminadasConPrioridadMedia.push(listaTareas[key]);
      }else if(listaTareas[key].prioridadTarea == "Baja" && listaTareas[key].avanzeTarea != 100){
        this.listaNoTerminadasConPrioridadBaja.push(listaTareas[key]);        
      }

    }
  }


}
