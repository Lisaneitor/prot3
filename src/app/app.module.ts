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
import { CuentaComponent } from './components/shared/cuenta/cuenta.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms'; // <-- importa esto
import { HttpClientModule } from '@angular/common/http';
import { AddUserComponent } from './components/admin/usuarios/add-user/add-user.component';
import { EditUserComponent } from './components/admin/usuarios/edit-user/edit-user.component';
import { ConfirmDialogComponent } from './components/shared/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { EditPathComponent } from './components/anlista/rutas-activas/edit-path/edit-path.component';
import { AddOfferComponent } from './components/anlista/rutas-activas/add-offer/add-offer.component';


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
    CuentaComponent,
    AddUserComponent,
    EditUserComponent,
    EditPathComponent,
    AddOfferComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    MatButtonModule,
    ConfirmDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
