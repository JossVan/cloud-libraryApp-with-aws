import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './footer/footer.component';
import { RegistroComponent } from './registro/registro.component';
import {ApiService} from './services/api.service';
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
    CrearComponent,
    LoginComponent,
    FooterComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
