import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {

  constructor(private api:ApiService, private toastr:ToastrService) { }
  
  user:any;
  array:any[]=[];
  titulo:string="";
  sinopsis:string="";
  contenido:string="";
  seleccion:string="";
  selec:any;
  ngOnInit(): void {
    this.user=JSON.parse(localStorage.getItem("usuario"));
    this.getHistories();
  }

  getHistories(){
    this.api.getHistories(this.user.usuario).subscribe(l=>{
      let a=JSON.stringify(l);
      let b=JSON.parse(a)
     
      if(b.msj.length!=0){
        for(let i=0;i<b.msj.length;i++){
          this.array.push({
            Titulo:b.msj[i].Titulo,
            Sinopsis:b.msj[i].Sinopsis,
            Contenido:b.msj[i].Contenido,
            Codigo:b.msj[i].Codigo
          })
        }
      }
    })
    console.log(this.array)
  }

  addHistory(){
    if(this.sinopsis!="" && this.titulo!="" && this.contenido!=""){
      this.api.addHistory(this.user.usuario,this.titulo,this.sinopsis,this.contenido).subscribe(l=>{
        let a=JSON.stringify(l);
        let b=JSON.parse(a);
        if(b.status==100){
          this.toastr.success("¡Se ha guardado tu historia!")
        }else if(b.status==200){
          console.log(b.msj)
          this.toastr.info("Ya tienes una historia con el mismo nombre, ¡cambialo!")
        }else{
          this.toastr.warning("No se ha guardado la historia")
        }
      })
    }else{
        this.toastr.info("Debes rellenar todos los campos")
    }
  }

  setHistory(){
    if(this.sinopsis!="" && this.titulo!="" && this.contenido!=""){
      let n=this.titulo.replace(/ /g, "")
      this.api.setHistories(this.user.usuario+n,this.user.usuario,
        this.titulo,this.sinopsis,this.contenido).subscribe(l=>{
          let a=JSON.parse(JSON.stringify(l))
          if(a.status==100){
            this.array=[];
            this.getHistories()
            this.toastr.success("¡Se han guardado tus cambios!")
          }else{
            this.toastr.warning("No se han guardado los cambios")
          }
        })
    }else{
      this.toastr.info("Debes rellenar todos los campos")
    }
  }
  onChange(){

    this.selec=(<HTMLInputElement>document.getElementById("selector")).value
    this.array.forEach(elemento=>{
      if(elemento.Titulo==this.selec){
        this.titulo=elemento.Titulo;
        this.sinopsis=elemento.Sinopsis;
        this.contenido=elemento.Contenido;
      }
    })
  }

  
}
