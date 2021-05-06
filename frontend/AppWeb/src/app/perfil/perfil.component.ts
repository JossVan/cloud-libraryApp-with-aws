import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  email:string="";
  nombre:string="";
  apellido:string="";
  usuario:string="";
  pass:string="";
  datos:string | null="";
  constructor(private tostr:ToastrService, private api:ApiService) { }

  ngOnInit(): void {
    this.datos=localStorage.getItem('usuario');
    
    if(this.datos!=null){
     
      let array=JSON.parse(this.datos);
      
      this.email=array.correo;
      this.nombre=array.nombre;
      this.apellido=array.apellido;
      this.usuario=array.usuario;
      
    }
  }


  editar(){

    if(this.nombre=="" || this.apellido=="" || this.usuario=="" || this.pass==""){
      this.tostr.info('¡Hay campos vacíos!');
    }else{
     
      if(this.datos!=null){
        let array=JSON.parse(this.datos);
        let actual=array.usuario;
        let user={
          usuario:this.usuario,
          nombre:this.nombre,
          apellido:this.apellido,
          correo:this.email
        }
    
      this.api.editarDatos(actual,user.usuario,user.nombre,user.apellido,user.correo,this.pass).subscribe(result=>{
        console.log("paso")
        result=JSON.stringify(result);
        let data=JSON.parse(result);
        
        if(data.status==100){
          localStorage.setItem('usuario',JSON.stringify(user));
          this.tostr.success("Se han editado sus datos");
        }else{
          this.tostr.error('Se ha producido un error al actualizar tus datos')
        }
      })
      }

    }

  }


}
