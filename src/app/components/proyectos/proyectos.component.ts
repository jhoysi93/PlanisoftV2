import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { FirebaseService } from "../../services/firebase.service";
import { Auth } from "../../services/auth.service";
import { Proyecto } from "../../clases/Proyecto.interface";

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styles: []
})
export class ProyectosComponent implements OnInit, OnChanges {
  @ViewChild('closeModal') closeModal: ElementRef;
  @ViewChild('closeModalEliminar') closeModalEliminar: ElementRef;


  @Output() eventoPoyecto = new EventEmitter<string>();
  @Output() eventoNamePoyecto = new EventEmitter<string>();
  @Output() fechasPoyecto = new EventEmitter<string[]>();
  nombrePoyect: string = "";
  descripcionProyect: string = "";
  fechasArray: string[] = ["",""];

  formato: FormGroup;
  buttonCrearProyecto: boolean = false;
  buttonGuardarCambios: boolean = false;
  listaProyectos: any[];
  proyecto: Proyecto = {
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: ""
    //  fechasNoTrabajadas: [""]
  };


  constructor(public _firebaseService: FirebaseService
    , private _auth: Auth) {
    this.formato = new FormGroup({
      'nombre': new FormControl('', [
        Validators.required
      ]),
      'descripcion': new FormControl('', [
        Validators.required
      ]),
      'fechaInicio': new FormControl('2017-11-11', [
        Validators.required
      ]),
      'fechaFin': new FormControl()
      // 'fechasNoTrabajadas': new FormArray([
      //   new FormControl('2017-04-22', Validators.required)
      // ]),
    });
    this.formato.controls['fechaFin'].setValidators([
      Validators.required,
      this.validarFechas.bind(this.formato)
    ])

    this.cargarProyectos();
  }

  validarFechas(control: FormControl): { [s: string]: boolean } {
    console.log("control.value");
    console.log(control.value);

    let forma: any = this;
    let fechaInicioAux: number[] = String(forma.controls['fechaInicio'].value).split("-").map(Number);
    let fechaFinAux: number[] = String(control.value).split("-").map(Number);
    //anio /mes/dias
    if (fechaInicioAux[0] >= fechaFinAux[0] && fechaInicioAux[1] >= fechaFinAux[1] && fechaInicioAux[2] >= fechaFinAux[2]) {
      return {
        validarFechas: true
      }
    }
    return null;

  }

  limpiarCamposModal() {
    this.buttonCrearProyecto = true;
    this.buttonGuardarCambios = false;
    this.tam = 0;

    this.formato.reset(this.proyecto);

    /*this.formato = new FormGroup({
      'nombre': new FormControl('', [
        Validators.required
      ]),
      'descripcion': new FormControl('', [
        Validators.required
      ]),
      'fechaInicio': new FormControl('', [
        Validators.required
      ]),
      'fechaFin': new FormControl('', [
        Validators.required
      ]),
      //    'fechasNoTrabajadas': new FormArray([
      //     new FormControl('2017-04-22', Validators.required)
      //   ]),
    });*/

  }
  agregarFechasNoTrabajadas() {
    (<FormArray>this.formato.controls['fechasNoTrabajadas']).push(
      new FormControl('', Validators.required)
    )
    this.tam++;
  }

  ngOnInit() {
    this.formato.value.fechasNoTrabajadas = [""];


  }

  mandarIdPoyect(id: string, nameProyecto: string, fechaInicio: string, fechaFin: string, descripcion: string) {
    this.eventoPoyecto.emit(id);
    this.eventoNamePoyecto.emit(nameProyecto);
    this.fechasArray = [fechaInicio, fechaFin];
    this.fechasPoyecto.emit(this.fechasArray);
    this.nombrePoyect = nameProyecto;
    this.descripcionProyect = descripcion;

  }

  ngOnChanges() {
    console.log("this.formato");
    this._firebaseService.cargarProyectos(this._auth.getProfile().user_id);
  }

  cargarProyectos() {
    console.log('cargando');
    this._firebaseService.cargarProyectos(this._auth.getProfile().user_id);

  }

  guardarProyecto(queHacer: string) {


    if (queHacer == 'g') {

      console.log(this.formato.value.nombre);

      this.closeModal.nativeElement.click();

      let pro: Proyecto = {
        nombre: this.formato.value.nombre,
        descripcion: this.formato.value.descripcion,
        fechaInicio: this.formato.value.fechaInicio,
        fechaFin: this.formato.value.fechaFin

        //fechasNoTrabajadas: this.formato.value.fechasNoTrabajadas
      }
      this._firebaseService.crearProyecto(pro)
        .then(() => {
          console.log('proyecto agregado')

        })
        .catch((error) => console.log(error));


    } else {
      //actualizar

      this.closeModal.nativeElement.click();

      let pro: Proyecto = {
        nombre: this.formato.value.nombre,
        descripcion: this.formato.value.descripcion,
        fechaInicio: this.formato.value.fechaInicio,
        fechaFin: this.formato.value.fechaFin
        // fechasNoTrabajadas: this.proyecto.fechasNoTrabajadas
      }
      this._firebaseService.actualizarProyecto(this.keyProyec, pro)
        .then(() => {
          console.log('proyecto agregado')
        })
        .catch((error) => console.log(error));
      console.log("pro");
      console.log(pro);
    }



  }

  tam: number = 1;
  keyProyec: string;
  setFormulario(keyProyecto: string) {

    this.buttonCrearProyecto = false;
    this.buttonGuardarCambios = true;
    console.log(keyProyecto)
    this.keyProyec = keyProyecto;
    this._firebaseService.getProyecto(keyProyecto).subscribe((data: Proyecto) => {
      this.proyecto = data;

      this.formato = new FormGroup({
        'nombre': new FormControl(data.nombre, [
          Validators.required
        ]),
        'descripcion': new FormControl(data.descripcion, [
          Validators.required
        ]),
        'fechaInicio': new FormControl(data.fechaInicio, [
          Validators.required
        ]),
        'fechaFin': new FormControl(data.fechaFin, [
          Validators.required
        ]),
        //'fechasNoTrabajadas': new FormArray([
        //  new FormControl(data.fechasNoTrabajadas, Validators.required)
        //]),
      });


    });
  }


  proyectKey: string;
  nombreProyect: string;
  setDatosModal(proyectKey: string, nombreProyect: string) {
    this.proyectKey = proyectKey;
    this.nombreProyect = nombreProyect;
    // console.log(this.formato.controls['fechasNoTrabajadas'].value);
  }

  eliminarProyecto() {

    this.closeModalEliminar.nativeElement.click();
    this._firebaseService.eliminarPoyecto(this.proyectKey)
      .then(() => console.log('proyecto eliminada exitosamente'))
      .catch((error) => console.error(error))


  }


}
