import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { ExplorarComponent } from './explorar/explorar.component';
import { VisorComponent } from './visor/visor.component';
import { BibliotecaComponent } from './biblioteca/biblioteca.component';
import { ExtraerComponent } from './extraer/extraer.component';
import { FavoritosComponent } from './favoritos/favoritos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CrearComponent } from './crear/crear.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ExplorarComponent,
    VisorComponent,
    BibliotecaComponent,
    ExtraerComponent,
    FavoritosComponent,
    PerfilComponent,
    CrearComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
