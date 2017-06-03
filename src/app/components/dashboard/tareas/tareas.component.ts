import { Component, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { Observable } from 'rxjs/Rx'
import { Tarea } from '../../../clases/Tarea';
import { FirebaseService } from "../../../services/firebase.service";
import { Auth } from "../../../services/auth.service";


@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styles: []
})
export class TareasComponent implements OnChanges {

  @Input('idProyectRecivido') idProyectRecivido: string;
  @Input('nameProyectRecivido') nameProyectRecivido: string = "";
  @Input('fechasRecividas') fechasRecividas: string[];
  @ViewChild('closeModal') closeModal: ElementRef;

  mostrarNuevaTarea: boolean = false;
  idTarea: string = "";
  guardarCambiosTareaButton: boolean = false;
  guardarNuevaTareaButton: boolean = false;
  novalidoAlert: boolean = false;
  sivalidoAlert: boolean = false;
  activarFuracion: boolean = false;
  danger: boolean = false;

  formato: FormGroup;

  avanzeNum: number[] = [0 ,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
    81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];

  tarea: Tarea = {
    nombreTarea: "tarea",
    descripcionTarea: "descripcion",
    fechaInicio: "2017-04-22",
    fechaFin: "2017-04-25",
    duracionTarea: 0,
    prioridadTarea: "prioridad",
    avanzeTarea: 60,
    encargadoTarea: "encargado"
  }

  duracionTareaAux: number = 0;


  ngOnChanges() {
    console.log("fechas recividas");
    console.log(this.fechasRecividas);
    this._firebaseService.cargarTareas(this._auth.getProfile().user_id, this.idProyectRecivido);
  }

  //metodo para setear 
  llaveTarea: string;
  nombreTarea: string;
  showModal(tarea: string, nombreTarea: string) {
    this.llaveTarea = tarea;
    this.nombreTarea = nombreTarea;
    this.mostrarNuevaTarea = false;
    this.guardarCambiosTareaButton = false;
  }


  constructor(public _firebaseService: FirebaseService, public _auth: Auth) {
    this.formato = new FormGroup({
      'nombreTarea': new FormControl('', [
        Validators.required
      ]),
      'descripcionTarea': new FormControl('', [
        Validators.required
      ]),
      'fechaInicio': new FormControl('',
        Validators.required
      ),

      'fechaFin': new FormControl('',
        Validators.required
      ),

      'duracionTarea': new FormControl('', [
        Validators.required
      ]),

      'prioridadTarea': new FormControl('', [
        Validators.required
      ]),
      'avanzeTarea': new FormControl('', [
        Validators.required, Validators.maxLength(3)
      ]),
      'encargadoTarea': new FormControl('', [
        Validators.required
      ])
    });
    this._firebaseService.cargarTareas(this._auth.getProfile().user_id, this.idProyectRecivido);


  }



  desplegarVentanaDeTarea() {
    if (this.idProyectRecivido.length > 0) {


      this.guardarNuevaTareaButton = true;
      this.guardarCambiosTareaButton = false;
      this.novalidoAlert = false;
      this.sivalidoAlert = false;
      this.mostrarNuevaTarea = !this.mostrarNuevaTarea
      this.tarea = {
        nombreTarea: "",
        descripcionTarea: "",
        fechaInicio: "",
        fechaFin: "",
        duracionTarea: 0,
        prioridadTarea: "",
        avanzeTarea: 0,
        encargadoTarea: ""
      }
    }
  }

  guardarTarea(queHacer: string) {

    //variables q acen referencia al objeto q nos da el formulario
    let ini = this.formato.value.fechaInicio;
    let fin = this.formato.value.fechaFin;

    let nombreTarea = this.formato.value.nombreTarea;
    let descripcionTarea = this.formato.value.descripcionTarea;

    let prioridadTarea = this.formato.value.prioridadTarea;
    let avanzeTarea = this.formato.value.avanzeTarea;
    let encargadoTarea = this.formato.value.encargadoTarea;
    ///variable de fechas de inicio del proyecto
    let fechaInicioProyecto: number[] = this.fechasRecividas[0].split("-").map(Number);
console.log(this.formato.value);
//validad avanze en 0
 
    //si hay campos vacios damos error
    if (ini == "" || fin == "" || nombreTarea == "" || descripcionTarea == "" || prioridadTarea == ""  || encargadoTarea == "") {
      console.log("error de fecha vacia");
      this.novalidoAlert = true;
      this.sivalidoAlert = false;
      //si no estan vacias  convertimos la fecha a vectores para validar las fechas
    } else {
    
      let anioIni: number[] = ini.split("-");
      let anioFin: number[] = fin.split("-");

      //["2017", "04", "22"]

      //si el anio inicial es menor damos error
      if (anioIni[0] > anioFin[0]) {

        console.log("error anio menor");
        //variables para mostrar o ocultar mensajes en el htlm
        this.novalidoAlert = true;
        this.sivalidoAlert = false;
      } else if ( anioIni[0] < fechaInicioProyecto[0] ){
        this.novalidoAlert = true;
        this.sivalidoAlert = false;
        console.error("año proyecto no valida")
      } else if ( anioIni[0] <= fechaInicioProyecto[0] && anioIni[1] < fechaInicioProyecto [1]){
        this.novalidoAlert = true;
        this.sivalidoAlert = false;
        console.error("mes proyecto no valida")
      }else if ( anioIni[0] <= fechaInicioProyecto[0] && anioIni[1] <= fechaInicioProyecto [1] && anioIni[2] < fechaInicioProyecto[2]){

        this.novalidoAlert = true;
        this.sivalidoAlert = false;
        console.error("dia proyecto no valida")
        //si el mes es menor q el incial damos error
      }else if (anioIni[1] > anioFin[1] && anioIni[0] === anioFin[0]) {
        this.novalidoAlert = true;
        this.sivalidoAlert = false;
        console.log("error mes menor");
        //si el dia y el mes es menor q el inicial damos error
      } else if (anioIni[2] > anioFin[2] && anioIni[1] >= anioFin[1] && anioIni[0] === anioFin[0]) {
        this.novalidoAlert = true;
        this.sivalidoAlert = false;
        console.log("error dia menor");

        //SI ES UNA FECHA VALIDA operamos para tener la duracion
      } else {  //["2017", "04", "22"]
        //var auxiliar de duracion
        let duracaionAux: number = 0;
        //si estamos en el mismo mes solo restamos los dias y asignamos a la variable auxiliar
        if (anioIni[1] === anioFin[1] && anioIni[0] === anioFin[0]) {
          duracaionAux = Number(anioFin[2]) - Number(anioIni[2]);
          // y si no allamos la diferencia entre los mesesy almacenamos en la var direfencia de meses
        } else if (anioIni[1] != anioFin[1] && anioIni[0] === anioFin[0]) {
          let diferenciaMeses: number = Number(anioFin[1]) - Number(anioIni[1]);
          //si la direrencia entre meses es solo 1
          if (diferenciaMeses == 1) {
            //restaamos a la fecha ini la suma de 31 ejemplo ini=15-31   === 16
            let iniAux: number = 31 - Number(anioIni[2]);
            //y lo sumamos a la cantidad de dias de fechafin ejemplo   0+16 + 10    (10 seria la fechafin) y lo almacenamos en nuestra variable auxiliar q al final 
            //asignaremos a nuestra variable de clase
            duracaionAux = iniAux + Number(anioFin[2]);
            //si es mas de 1 mes de diferenciaMeses iteremos sumando 30 a cada mes de direfencia
          } else {
            //restaamos a la fecha ini la suma de 31 ejemplo ini=15-31   === 16
            let iniAux: number = 31 - Number(anioIni[2]);
            //y lo sumamos a la cantidad de dias de fechafin ejemplo   0+16 + 10    (10 seria la fechafin) y lo almacenamos en nuestra variable auxiliar q al final 
            //asignaremos a nuestra variable de clase
            duracaionAux = iniAux + Number(anioFin[2]);
            //si es mas de 1 mes de diferenciaMeses iteremos sumando 30 a nuestra variable auxiliar por cada mes de direfencia 
            for (let i = 1; i < diferenciaMeses; i++) {
              duracaionAux = duracaionAux + 30;
            }
          }
        } else if (anioIni[1] === anioFin[1] && anioIni[0] != anioFin[0]) {
          let iniAux: number = 31 - Number(anioIni[2]);
          //y lo sumamos a la cantidad de dias de fechafin ejemplo   0+16 + 10    (10 seria la fechafin) y lo almacenamos en nuestra variable auxiliar q al final 
          //asignaremos a nuestra variable de clase
          duracaionAux = iniAux + Number(anioFin[2]);
          //si es mas de 1 mes de diferenciaMeses iteremos sumando 30 a cada mes de direfencia
          let difAnios: number = Number(anioFin[0]) - Number(anioIni[0]);
          if (anioFin[2] > anioIni[2]) {
            let diasDif: number = Number(anioFin[2]) - Number(anioIni[2]);
            for (let i = 0; i < difAnios; i++) {
              diasDif += 365;
            }
            duracaionAux = diasDif;
          } else {

            let diasAux = Number(anioIni[2]) - Number(anioFin[2]);
            for (let i = 0; i < difAnios; i++) {
              duracaionAux += 365;
            }
            duracaionAux = duracaionAux - diasAux;

          }
          duracaionAux = duracaionAux - 31;

        } else if (anioIni[1] != anioFin[1] && anioIni[0] != anioFin[0]) {
          let difAnio: number = Number(anioFin[2]) - Number(anioIni[2]);
          if (Number(anioIni[1]) > Number(anioFin[1])) {
            let difMes: number = Number(anioIni[1]) - Number(anioFin[1]);
            let doce: number = 12 - difMes;
            if (difAnio === 1) {
              let difDias = 31 - Number(anioIni[2]);
              if (doce === 1) {
                let dias = (31 - Number(anioIni[2])) + Number(anioFin[2]);
                duracaionAux = dias;

              } else {

                for (let i = 0; i < doce; i++) {
                  difDias = difDias + 30;
                }
                duracaionAux = difDias;
              }
              /*fin anio=1*/
            } else if (difAnio != 1) {

              let difDias = 31 - Number(anioIni[2]);
              if (doce === 1) {
                let dias = (31 - Number(anioIni[2])) + Number(anioFin[2]);
                duracaionAux = dias;

              } else {

                for (let i = 0; i < doce; i++) {
                  difDias = difDias + 30;
                }
                duracaionAux = difDias;
              }
              for (let z = 0; z < difAnio; z++) {
                duracaionAux += 365;
              }
            }
            //fin anio distinto
          }//fin mes ini maypr a mes final
          else if (Number(anioFin[1]) > Number(anioFin[1])) {//mes final mayor a mes inicio
            let difMes = Number(anioFin[1]) - Number(anioIni[1]);
            let difAnio = Number(anioFin[0]) - Number(anioIni[0]);
            let res: number = 0;
            if (difAnio === 1) {
              let difDias = 31 - Number(anioIni[2]);
              res = difDias + Number(anioFin[2]);
              for (let x = 0; x < difMes; x++) {
                res = res + 31;
              }
              duracaionAux = res;
            } else if (difAnio != 1) {
              let difDias = 31 - Number(anioIni[2]);
              res = difDias + Number(anioFin[2]);
              for (let x = 0; x < difMes; x++) {
                res = res + 31;
              }
              for (let y = 0; y < difAnio; y++) {
                res += 365;
              }
              duracaionAux = res;
            }
          }
          duracaionAux = duracaionAux - 12;
        }//fin todo distinto



        //como seguimos dentro del esle que verificaba fechas validas imprimimos q se guardo con exito
        console.log("datos guardados extio");

        this.novalidoAlert = false;
        this.sivalidoAlert = true;
        //para finalizar vemos si al final de todo nuestra variable auxiliar sale con una duracion distinta a cero
        //para poder asignarla a nuestra variable de clase
        if (duracaionAux !== 0) {
          this.duracionTareaAux = duracaionAux;
          //si no le asignamos cero por default
        } else {
          this.duracionTareaAux = 0;
        }
        //creamos un objeto del tipo tare listo para subir a firebase dandole todos los valores del formato 
        let tareAux: Tarea = new Tarea(
          String(this.formato.value.nombreTarea),
          String(this.formato.value.descripcionTarea),
          String(this.formato.value.fechaInicio),
          String(this.formato.value.fechaFin),
          Number(this.duracionTareaAux),
          String(this.formato.value.prioridadTarea),
          Number(this.formato.value.avanzeTarea),
          String(this.formato.value.encargadoTarea),
        );
        this.tarea = tareAux;
        console.log("tareA");
        console.log(tareAux);
        //esta linea es opcional ya q podemos subir directamente el objeto tarea
        //this.formato.setValue(tareAux);
        console.log("formato");
        console.log(this.formato.value);

        //si el parametro es g significa q kieren guardar una nueva tarea
        if (queHacer == 'g') {

          //llamammos al metodo encargado de subir el objeto a firebase
          this.guardarNuevaTarea(this.tarea);
        } else {
          this.guardarCambiosTareaEditada(this.tarea);
          this.guardarCambiosTareaButton = false;
        }
        this.mostrarNuevaTarea = false;
      }//fin else que asigna la duracion
    }//fin else q primero verificaba si era una fecha valida y convertia a numbers las fechas   
  }//fin metodo



  //metodo q ara uso del servicio de firebase para subir la tarea
  guardarNuevaTarea(tareAux: Tarea) {
    this._firebaseService.crearTarea(this.idProyectRecivido, tareAux)
      .then(() => console.log('tarea creada'))
      .catch((error) => console.log(error));
    this.novalidoAlert = false;
    this.sivalidoAlert = false;
  }



  activarDuracion() {
    this.activarFuracion = true;
    // this.mostrarNuevaTarea = false;
  }


  editarTarea(id_tarea: string) {
    console.log(id_tarea);
    this.mostrarNuevaTarea = true;
    this.guardarCambiosTareaButton = true;
    this.guardarNuevaTareaButton = false;

    this.idTarea = id_tarea;
    this._firebaseService.obtenerTarea(id_tarea).subscribe((data: Tarea) => {
      this.tarea = data;
      console.log(" edicion");
      console.log(data)

    })
    this.novalidoAlert = false;
    this.sivalidoAlert = false;

  }


  guardarCambiosTareaEditada(tareAux: Tarea) {
    this.activarFuracion = true;

    this._firebaseService.editarTarea(this.idTarea, tareAux)
      .then(() => {
        console.log("this.idTarea");
        console.log(this.idTarea);

      });
  }



  eliminarTarea() {
    this._firebaseService.eliminarTarea(this.llaveTarea)
      .then(() => console.log('tarea eliminada'))
      .catch((error) => console.log(error))
    this.closeModal.nativeElement.click();
  }

  //metodo para setear la clase del body de la tabla
  activarClassDanger(fechaFin: string, avanzeTarea: number): boolean {
    let dateActual: Date = new Date();
    let diaActual: number = dateActual.getDate();
    let mesActual: number = dateActual.getMonth() + 1;
    let anioActual: number = dateActual.getFullYear();
    let fechaFinalNumber: number[] = fechaFin.split("-").map(Number);
    ///variable de fechas de fin del proyecto
    let fechaInicioProyecto: number[] = this.fechasRecividas[1].split('-').map(Number);

    if (avanzeTarea == 100) {
      return false;
    }

    if (anioActual > fechaFinalNumber[0] && avanzeTarea != 100) {
      return true;
    } else if (mesActual > fechaFinalNumber[1] && anioActual >= fechaFinalNumber[0] && avanzeTarea != 100) {
      return true;
    } else if (diaActual > fechaFinalNumber[2] && mesActual >= fechaFinalNumber[1] && anioActual >= fechaFinalNumber[0] && avanzeTarea != 100) {
      return true;
    }else if( fechaFinalNumber[0] > fechaInicioProyecto[0] ){
      return true;
    }else if ( fechaFinalNumber[0] >= fechaInicioProyecto[0]  && fechaFinalNumber[1] > fechaInicioProyecto[1] ){
      return true;
    }else if ( fechaFinalNumber[0] >= fechaInicioProyecto[0]  && fechaFinalNumber[1] >= fechaInicioProyecto[1] && fechaFinalNumber[2] > fechaInicioProyecto[2]){
      return true;
    } else {
      return false;
    }

  }

  activarClaseSuccess(avanzeTarea: number): boolean {
    if (avanzeTarea == 100) {
      return true;
    } else {
      return false;
    }
  }


}
