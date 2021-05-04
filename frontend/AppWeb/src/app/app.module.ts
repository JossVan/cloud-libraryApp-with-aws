import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import Amplify, {Interactions } from 'aws-amplify';

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
import { BotComponent } from './bot/bot.component';

Amplify.configure({
  Auth: {
    identityPoolId: 'us-east-1:cbf39d6a-f75d-4fc6-95f3-d6ce1d2b3ebc',
    region: 'us-east-1'
  },
  Interactions: {
    bots: {
      "botsito": {
        "name": "botsito",
        "alias": "$LATEST",
        "region": "us-east-1",
      },
    }
  }
});


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
    BotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
