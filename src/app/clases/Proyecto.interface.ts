import { Tarea } from "../clases/Tarea";

export class Proyecto {

    constructor(public nombre: string,
                public descripcion: string
                , public fechaInicio:string,
                public fechaFin:string,
                public tareas?:Tarea[]) {

    }
}