export class Tarea{
    

    constructor(public nombreTarea:string,
                public descripcionTarea:string,
                public fechaInicio:string,
                public fechaFin:string,
                public duracionTarea:number,
                public prioridadTarea:string,
                public avanzeTarea:number,
                public encargadoTarea:string){
    }    
}