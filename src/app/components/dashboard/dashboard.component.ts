import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth.service';
import { FirebaseService } from '../../services/firebase.service';
import { User } from '../../clases/User';
import { FirebaseListObservable } from 'angularfire2/database';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  idProyect: string = "";
  nameProyecto: string = "";
  usuario: Object;
  userPath: FirebaseListObservable<any>;
  existe: boolean = false;
  formato: FormGroup;
  mostrarVentanaNuevaFecha: boolean = false;
  fecha: string = "2017-11-11";
  desplegarFormulario: boolean = false;

  constructor(private auth: Auth, private firebaseService: FirebaseService) {
    this.usuario = auth.getProfile();
    console.log(this.usuario);
    //si este objeto existe en la base de datos me cargas su info si no creas el nuevo user
    //let existe = firebaseService.checkUserExist2(auth.getProfile().user_id);

    this.formato = new FormGroup({
      'fecha': new FormControl('', [
        Validators.required])
    });

    firebaseService.checkUserExist2(auth.getProfile().user_id, new User(this.auth.getProfile().name, this.auth.getProfile().user_id));



  }


  ngOnInit() {
  }

  reciveIdProyect(event: string) {
    this.idProyect = event;
    if (this.idProyect.length > 0) {

      this.desplegarFormulario = true;
      this.firebaseService.cargarFechasNoTrabajadas(this.auth.getProfile().user_id, this.idProyect);
    }

  }
  reciveNameProyect(event: string) {
    this.nameProyecto = event;
  }
  fechas:string[];
  reciveFechas(fechas:string[]){
    this.fechas = fechas;
  }


  guardarFecha(queHacer: string) {
    this.mostrarVentanaNuevaFecha = false;
    if (queHacer == 'g') {
      this.fecha = this.formato.value.fecha;
      this.firebaseService.crearFechaNoTrabajada(this.idProyect, this.fecha)
        .then(() => console.log('fecha creada exotosamente'))
        .catch((error) => console.log(error));
    }

  }

  eliminarFecha(fechakey: string) {
    console.log(fechakey);
    this.firebaseService.eliminarFecha(fechakey)
            .then( () => console.log("fecha elimninada con exito"))
            .catch( (error) => console.error(error));

  }

}
