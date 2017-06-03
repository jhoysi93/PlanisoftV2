import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GraficosComponent } from './components/graficos/graficos.component';
import { AuthGuardService } from './services/auth-guard.service';

import { GRAFICAS_ROUTES } from "./components/graficos/grafico.routes";

const ROUTES: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', 
        component: DashboardComponent,
        canActivate:  [AuthGuardService]
      },
      
  { path: 'graficos', 
        component: GraficosComponent ,
        canActivate: [AuthGuardService],
        children: GRAFICAS_ROUTES
          
      },
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

export const ROUTES_COMPONENT = RouterModule.forRoot(ROUTES);