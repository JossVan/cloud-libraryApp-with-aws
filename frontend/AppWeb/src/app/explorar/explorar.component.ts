import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import {ToastrService} from 'ngx-toastr'
@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.component.html',
  styleUrls: ['./explorar.component.css']
})
export class ExplorarComponent implements OnInit {
  user:any=[]
  array:any[]=[]
  constructor(private api:ApiService, private router:Router, private toastr: ToastrService) {
    this.api.getLibros().subscribe(l=>{
      let a=JSON.stringify(l);
      let b=JSON.parse(a);
      let contador=0;
      for(let i=0;i<b.length;i++){
        contador++;
        this.array.push({
          Portada:b[i].Portada,
          Nombre:b[i].Nombre,
          Codigo:b[i].Codigo,
          Libro:b[i].Libro,
          Autor:b[i].Autor,
          Sinopsis:b[i].Sinopsis
        })
      }
    })
   
   }

  ngOnInit(): void {
    this.user=JSON.parse(localStorage.getItem("usuario"));
  }

  leer(comp){
    this.array.forEach(elemento=>{
      if (elemento.Codigo==comp){
        localStorage.setItem("libro",String(elemento.Libro));
        this.router.navigate(["/visor"]);
        return
      }
    })
  }

  agregarBiblioteca(comp){
    this.array.forEach(elemento=>{
      if (elemento.Codigo==comp){
        this.api.setBiblioteca(elemento.Codigo,elemento.Nombre,elemento.Autor,elemento.Libro,
          elemento.Portada,elemento.Sinopsis,this.user.usuario).subscribe(el=>{
            let a=JSON.stringify(el);
            let b=JSON.parse(a);
            if(b.status==200){
              this.toastr.info("Este libro ya se ha añadido a tu biblioteca");
            }else if(b.status==100){
              this.toastr.success("Se ha agregado este libro a tu biblioteca")
            }else{
              this.toastr.error("Ha ocurrido un error, intenta de nuevo")
              console.log(b.msj)
            }
          })
      } 
    })
  }

}
