import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { User } from '../clases/User';
import { Tarea } from "../clases/Tarea";
import { Proyecto } from "../clases/Proyecto.interface";

@Injectable()
export class FirebaseService {


    //verificar q de con string
    userKeyActual: User;
    idProyecto: string;

    proyectoPath: FirebaseListObservable<any[]>;
    tareaPath: FirebaseListObservable<any[]>;
    fechasNoTrabajadasPath: FirebaseListObservable<any[]>;

    tareaObtenida: FirebaseObjectObservable<any>;
    proyectoObtenido: FirebaseObjectObservable<any>;

    constructor(private angularFireDatabase: AngularFireDatabase) {

    }

    crearUser(user: User) {
        const userPath: FirebaseListObservable<any[]> = this.angularFireDatabase.list('/users');
        return userPath.push(user);
    }


    /*checkUserExist2(id: string, user: User): FirebaseListObservable<any[]> {
        const existeuserPath: FirebaseListObservable<any[]> = this.angularFireDatabase.list('/users/', {
            query: {
                orderByChild: 'user_id',
                equalTo: id
            }
        });

        existeuserPath.subscribe(resultados => {
            console.log("resultados");
            console.log(resultados);
            this.userKeyActual = resultados[0].$key;
            console.log("this.userKeyActual");
            console.log(this.userKeyActual);
            if (resultados.length == 0) {
                console.log("resultados ninguno iguala");
                this.crearUser(user);
            }
        }, error => {
            console.log("error");
            console.log(error);

        })
        return existeuserPath;

    }*/


    checkUserExist2(id: string, user: User): FirebaseListObservable<any[]> {

        const existeuserPath: FirebaseListObservable<any[]> = this.getKeyUserActual(id);
        existeuserPath.subscribe((resultados) => {
            if (resultados.length == 0) {
                console.log("resultados ninguno iguala");
                this.crearUser(user);
            }
        });
        return existeuserPath;

    }


    crearProyecto(proyecto: Proyecto) {
        const proyectoPath: FirebaseListObservable<any[]> = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos');
        return proyectoPath.push(proyecto);

    }



    /*cargarProyectos(id: User) {
        const existeuserPath: FirebaseListObservable<any[]> = this.angularFireDatabase.list('/users/', {
            query: {
                orderByChild: 'user_id',
                equalTo: id
            }
        });
        existeuserPath.subscribe(resultados => {
            console.log("resultados");
            console.log(resultados);
            this.userActual = resultados[0].$key;
            this.proyectoPath = this.angularFireDatabase.list('/users/' + this.userActual + '/proyectos');
            this.proyectoPath.subscribe(data => {
                console.log("this.proyectoPath");
                console.log(data);

            });
        }, error => {
            console.log("error");
            console.log(error);

        })
        return existeuserPath;

    }*/

    //metodo q setea el objeto
    cargarProyectos(user_id: string) {
        const existeuserPath: FirebaseListObservable<any[]> = this.getKeyUserActual(user_id);
        existeuserPath.subscribe(
            resultados => {
                this.userKeyActual = resultados[0].$key;
                this.proyectoPath = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos');
                this.proyectoPath.subscribe(data => {
                    console.log("this.proyectoPath");
                    console.log(data);
                });
            });
        return existeuserPath;

    }

    //metodo q setea el userKeyActual y necesesita el atributo user_id de un objeto usuario para poder setear 
    //su key en la propiedad de la clase
    //userKeyActual y poder usarla en otros metodos
    getKeyUserActual(user_id: string) {
        const userIDPath: FirebaseListObservable<any[]> = this.angularFireDatabase.list('/users/', {
            query: {
                orderByChild: 'user_id',
                equalTo: user_id
            }
        });
        userIDPath.subscribe(resultados => {
            console.log("resultados");
            console.log(resultados);
            this.userKeyActual = resultados[0].$key;
        }, error => {
            console.log("error");
            console.log(error);

        });
        return userIDPath;

    }



    crearTarea(idProyecto: string, tarea: Tarea) {
        const tareaPath: FirebaseListObservable<any[]> = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos/' + idProyecto + '/tareas/');
        return tareaPath.push(tarea);

    }


    cargarTareas(user_id: string, id_proyecto: string) {
        // const existeuserPath: FirebaseListObservable<any[]> = this.getKeyUserActual(user_id);
        //existeuserPath.subscribe(
        //resultados => {
        // this.userKeyActual = resultados[0].$key;
        this.idProyecto = id_proyecto;
        this.tareaPath = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos/' + id_proyecto + '/tareas/');
        this.tareaPath.subscribe(data => {
            console.log("this.proyectoPath");
            console.log(data);
        });
        //});
        return this.tareaPath;

    }
    obtenerTarea(id_tarea: string) {
        this.tareaObtenida = this.angularFireDatabase.object('/users/' + this.userKeyActual + '/proyectos/' + this.idProyecto + '/tareas/' + id_tarea);
        return this.tareaObtenida

    }
    editarTarea(id_tarea: string, tarea_editada: Tarea) {
        const tareaPath: FirebaseObjectObservable<any> = this.angularFireDatabase.object('/users/' + this.userKeyActual + '/proyectos/' + this.idProyecto + '/tareas/' + id_tarea);
        return tareaPath.update(tarea_editada);

    }

    actualizarProyecto(keyProyec: string, pro: Proyecto) {
        const proyectoPath: FirebaseObjectObservable<any> = this.angularFireDatabase.object('/users/' + this.userKeyActual + '/proyectos/' + keyProyec);
        return proyectoPath.update(pro);
    }



    eliminarTarea(idTarea: string) {
        const eliminarTareaPath: FirebaseListObservable<any> = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos/' + this.idProyecto + '/tareas');

        return eliminarTareaPath.remove(idTarea);
    }


    getProyecto(keyProyecto: string) {
        this.proyectoObtenido = this.angularFireDatabase.object('/users/' + this.userKeyActual + '/proyectos/' + keyProyecto);
        
        return this.proyectoObtenido
    }

    eliminarPoyecto(proyectKey: string) {
        const eliminarPoyectoPath: FirebaseListObservable<any> = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos/');

        return eliminarPoyectoPath.remove(proyectKey);
    }


    cargarFechasNoTrabajadas(user_id: string, keyProyecto: string) {

        const fechasNoTrabajadas: FirebaseListObservable<any[]> = this.getKeyUserActual(user_id);
        fechasNoTrabajadas.subscribe(userList => {
            this.userKeyActual = userList[0].$key;

            this.fechasNoTrabajadasPath = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos/' + keyProyecto + '/fechasNoTrabajadas/');
            this.fechasNoTrabajadasPath.subscribe((fechas) => {
                console.log("fechas");
                console.log(fechas);
                console.log(this.userKeyActual);

            });
        });




        return fechasNoTrabajadas;
    }


    crearFechaNoTrabajada(idProyecto:string,fecha:string){
        const fechaPath: FirebaseListObservable<any[]> = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos/' + idProyecto + '/fechasNoTrabajadas/');
        return fechaPath.push(fecha);
    }


     eliminarFecha(fechakey: string) {
    console.log(fechakey);
    const eliminarFechaPath: FirebaseListObservable<any> = this.angularFireDatabase.list('/users/' + this.userKeyActual + '/proyectos/' + this.idProyecto + '/fechasNoTrabajadas/');

        return eliminarFechaPath.remove(fechakey);
  }

}




