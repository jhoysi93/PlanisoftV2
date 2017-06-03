import { Component, OnInit, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styles: []
})
export class GraficosComponent implements OnInit, OnChanges {

  idProyect:string="";
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  }
  ngOnChanges(){
  this.idProyect;  
  }


reciveNameProyect(name:string){
  console.error("name");
  console.error(name);

}

reciveIdProyect(idProyect:string){
  this.idProyect = idProyect;
    this.router.navigate(['/graficos/estadisticos', this.idProyect]);

}

estadisticos(){
  this.router.navigate(['/graficos/estadisticos', this.idProyect]);

}
tablas(){
  this.router.navigate(['/graficos/tablas', this.idProyect]);

}
}
