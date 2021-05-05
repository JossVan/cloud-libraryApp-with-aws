import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
//import {ToastService} from 'ngx-toastr'
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public user:string=""
  public lastName:string=""
  public firstName:string=""
  public pass:string=""
  public pass2:string=""
  public email:string=""
  constructor(private api:ApiService,private router: Router, private toastr:ToastrService) { }

  ngOnInit(): void {
  }


  public registrarUsuario(){
    if(this.user=="" || this.lastName=="" || this.firstName=="" || this.pass=="" || this.pass2=="" ||
    this.email==""){
     this.toastr.warning('¡Atención!','No debe dejar campos vacíos')
    }else{
      if(this.pass==this.pass2){
        this.api.registrar(this.user,this.firstName,this.lastName,this.email,this.pass).subscribe(result=>{
          result=JSON.stringify(result)
          let array=JSON.parse(result)
          if (array.status==100){
            this.toastr.success('¡Se ha creado su perfil correctamente!')
            this.login();
          }else if(array.status==404){
           this.toastr.error('Error','No se ha podido crear su perfil, intente más tarde')
          }else{
            this.toastr.info('Este usuario ya existe, pruebe con otro')
          }
        })
      }else{
        this.toastr.warning('Las contraseñas no coiniciden')
      }
    }
  }

  public login(){
    this.router.navigate(['/login'])
  }

}
