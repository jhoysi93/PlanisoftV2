import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstadisticosComponent } from './estadisticos/estadisticos.component';
import { TablasComponent } from './tablas/tablas.component';


export const GRAFICAS_ROUTES:Routes = [
    { path: 'estadisticos/:id', component: EstadisticosComponent },
    { path: 'tablas/:id', component: TablasComponent},
    {path: '**', pathMatch:'full', redirectTo: 'estadisticos'}
];