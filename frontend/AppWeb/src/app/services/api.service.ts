import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private path:string;
  constructor(private httpClient:HttpClient) {
    this.path="http://localhost:8000"
   }

   registrar(Usuario:String,Nombre:String,Apellido:String,Email:String,Password:string): Observable<any>{
    return this.httpClient.post(this.path+'/registrarUsuario',
    {
      Email:Email,
      Usuario:Usuario,
      Nombre:Nombre,
      Apellido:Apellido,
      Password:Password,
    }
    );
  }

  loguearse(usuario:string, contra: string):Observable<any>{
    return this.httpClient.post(this.path+'/ingresar',{
        Usuario: usuario,
        Password: contra
    });
  }

  editarDatos(UsuarioActual:string,UsuarioNuevo:string,Nombre:string,
    Apellido:string,Correo:string,Password:string):Observable<any>{
     
    return this.httpClient.post(this.path+"/editarDatos",{
      UsuarioActual:UsuarioActual,
      UsuarioNuevo:UsuarioNuevo,
      Nombre:Nombre,
      Apellido:Apellido,
      correo:Correo,
      Password:Password,
    })
  }
  extraerTexto(imagen:string){
    return this.httpClient.post(this.path+"/extraerTexto",{
      Imagen:imagen
    })
  }

  getLibros():Observable<any>{
    return this.httpClient.get(this.path+"/libros");
  }

  setBiblioteca(codigo:String,Nombre:string,Autor:string,Libro:string,
    Portada:string,Sinopsis:string,usuario:string):Observable<any>{
    return this.httpClient.post(this.path+"/agregarBiblioteca",{
      Codigo:codigo,
      Nombre:Nombre,
      Autor:Autor,
      Libro:Libro,
      Portada:Portada,
      Sinopsis:Sinopsis,
      Usuario:usuario
    })
  }

  getBiblioteca(usuario:string){
    return this.httpClient.post(this.path+"/getBiblioteca",{
      Usuario:usuario
    })
  }

  eliminarBiblioteca(codigo:string){
    return this.httpClient.post(this.path+"/eliminarBiblioteca",{
      codigo:codigo
    })
  }

  addFavorite(codigo:string,fav:string):Observable<any>{
    return this.httpClient.post(this.path+"/favoritos",{
      codigo:codigo,
      Favorito:fav,
    })
  }

  getFavorite(usuario:string):Observable<any>{
    return this.httpClient.post(this.path+"/getFavoritos",{
      usuario:usuario
    })
  }

  addHistory(user:string,titulo:string,sinopsis:string,contenido:string):Observable<any>{
    return this.httpClient.post(this.path+"/addHistory",{
      user:user,
      titulo:titulo,
      sinopsis:sinopsis,
      contenido:contenido
    })
  }
  getHistories(usuario:string):Observable<any>{
    return this.httpClient.post(this.path+"/getHistories",{
      usuario:usuario
    })
  }
  setHistories(codigo:string,Usuario:string,Titulo:string,Sinopsis:string,Contenido:string){
    return this.httpClient.post(this.path+"/setHistories",{
      usuario:Usuario,
      codigo:codigo,
      Titulo:Titulo,
      Sinopsis:Sinopsis,
      Contenido:Contenido
    })
  }
}
