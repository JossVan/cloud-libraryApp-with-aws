import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {
  array:any[]=[];
  constructor(private api:ApiService,private toastr:ToastrService,private router:Router) { 
    this.api.getFavorite((JSON.parse(localStorage.getItem("usuario"))).usuario).subscribe(l=>{
      let a=JSON.stringify(l);
      let b=JSON.parse(a);
     
        for(let i=0;i<b.msj.length;i++){
          this.array.push({
          Portada:b.msj[i].Portada,
          Nombre:b.msj[i].Nombre,
          Codigo:b.msj[i].Codigo,
          Libro:b.msj[i].Libro,
          Autor:b.msj[i].Autor,
          Sinopsis:b.msj[i].Sinopsis
            }
          )
        }
    });

  }

  ngOnInit(): void {
    console.log(this.array)
  }
  ir(comp){

 
    localStorage.setItem("libro",String(comp));
    this.router.navigate(["/visor"]);
    return
  

}

  quitar(comp){
    this.api.addFavorite(comp,"0").subscribe(l=>{
      let a=JSON.stringify(l);
      let b=JSON.parse(a);
      if(b.status==100){
        this.toastr.success("Se ha quitado este libro de tus favoritos");
        this.actualizar()
      }
    })
  }
  actualizar(){
    this.router.navigate(["/home"])
  }
}
