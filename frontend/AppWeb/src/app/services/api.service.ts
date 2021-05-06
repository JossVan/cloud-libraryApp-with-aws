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

}
