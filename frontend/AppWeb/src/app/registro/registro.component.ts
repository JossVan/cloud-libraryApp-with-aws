import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';
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
  constructor(private api:ApiService) { }

  ngOnInit(): void {
  }


  public registrarUsuario(){
    if(this.user=="" || this.lastName=="" || this.firstName=="" || this.pass=="" || this.pass2=="" ||
    this.email==""){
      console.log("campos vacíos")
    }else{
      if(this.pass==this.pass2){
        this.api.registrar(this.user,this.firstName,this.lastName,this.email,this.pass).subscribe(result=>{
          result=JSON.stringify(result)
          let array=JSON.parse(result)
          if (array.status==100){
            console.log(array)
          }else if(array.status==404){
            console.log(array)
          }else{
            console.log(array)
          }
        })
      }else{
        console.log("contraseñas incorrectas")
      }
    }
  }

}
