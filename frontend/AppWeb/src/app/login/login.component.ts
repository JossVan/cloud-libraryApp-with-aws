import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {ApiService} from '../services/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public usuario:string="";
  public pass:string=""
  constructor(private api:ApiService,private router: Router, private toastr:ToastrService) { }

  ngOnInit(): void {
  }

  public login(){
    if(this.usuario=="" || this.pass==""){
      this.toastr.warning('¡Atención!','No debe dejar campos vacíos')
    }else{
      this.api.loguearse(this.usuario,this.pass).subscribe(result=>{
        result=JSON.stringify(result);
        let array=JSON.parse(result);
        if (array.status==100){
          let user={
            usuario:array.msj.Items[0].Usuario.S,
            nombre:array.msj.Items[0].Nombre.S,
            apellido:array.msj.Items[0].Apellido.S,
            correo:array.msj.Items[0].correo.S
          }
          localStorage.setItem('usuario',JSON.stringify(user))
          console.log(array)
          this.toastr.success('¡Bienvenido!')
          this.home();
        }else if (array.status==300){
          this.toastr.info('La contraseña es incorrecta')
        }else{
          this.toastr.error('Error','Error al iniciar sesión, intente de nuevo')
        }
      })
    }
  }

  public home(){
    this.router.navigate(['/home'])
  }
}
