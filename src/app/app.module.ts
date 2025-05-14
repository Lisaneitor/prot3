import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { CargaArchivosComponent } from './components/anlista/carga-archivos/carga-archivos.component';
import { GeneraRutasComponent } from './components/anlista/genera-rutas/genera-rutas.component';
import { RutasActivasComponent } from './components/anlista/rutas-activas/rutas-activas.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { UsuariosComponent } from './components/admin/usuarios/usuarios.component';
import { OfertaFormComponent } from './components/admin/oferta-form/oferta-form.component';
import { RolesComponent } from './components/admin/roles/roles.component';
import { CuentaComponent } from './components/cuenta/cuenta.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CargaArchivosComponent,
    GeneraRutasComponent,
    RutasActivasComponent,
    NavbarComponent,
    UsuariosComponent,
    OfertaFormComponent,
    RolesComponent,
    CuentaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
