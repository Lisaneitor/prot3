import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CargaArchivosComponent } from './components/anlista/carga-archivos/carga-archivos.component';
import { GeneraRutasComponent } from './components/anlista/genera-rutas/genera-rutas.component';
import { RutasActivasComponent } from './components/anlista/rutas-activas/rutas-activas.component';
import { UsuariosComponent } from './components/admin/usuarios/usuarios.component';
import { OfertaFormComponent } from './components/admin/oferta-form/oferta-form.component';
import { RolesComponent } from './components/admin/roles/roles.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';

const routes: Routes = [
  {path:'',redirectTo:'/inicio', pathMatch:'full'},
  {path:'inicio',component:LoginComponent},  
  {path:'cuenta',component:CuentaComponent},  
  {path:'analista',redirectTo:'analista/archivos'},
  { path: 'analista/archivos', component: CargaArchivosComponent },
  { path: 'analista/generar', component: GeneraRutasComponent },
  { path: 'analista/rutas', component: RutasActivasComponent },
  { path: 'admin/usuarios', component: UsuariosComponent },
  { path: 'admin/oferta', component: OfertaFormComponent },
  { path: 'admin/roles', component: RolesComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
