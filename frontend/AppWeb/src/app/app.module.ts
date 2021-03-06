import { NgModule } from '@angular/core';
import { BrowserModule,DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import Amplify, {Interactions } from 'aws-amplify';
import Predictions, { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
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
import {ToastrModule} from 'ngx-toastr';
import { BotComponent } from './bot/bot.component';
import { AudioComponent } from './audio/audio.component';
import { TraduccionComponent } from './traduccion/traduccion.component';

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
  },
  Predictions:{
    "convert":{
      "transcription": {
        "region": "us-east-1",
        "proxy": false,
        "defaults": {
            "language": "es-US"
        }
    }
    }
  },
  interpret: {
    "interpretText": {
        "region": "us-east-1",
        "proxy": false,
        "defaults": {
            "type": "ALL"
        }
    }
}
});

Amplify.addPluggable(new AmazonAIPredictionsProvider());

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
    RegistroComponent,
    CrearComponent,
    BotComponent,
    AudioComponent,
    TraduccionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
