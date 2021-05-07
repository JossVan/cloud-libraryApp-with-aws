import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.css']
})
export class BibliotecaComponent implements OnInit {
  user:any=[]
  array:any[]=[];
  constructor(private api:ApiService,private router:Router, private toastr:ToastrService) {
    //this.user=JSON.parse(localStorage.getItem("usuario"));
    
    this.api.getBiblioteca((JSON.parse(localStorage.getItem("usuario"))).usuario).subscribe(l=>{
      let a=JSON.stringify(l);
      let b=JSON.parse(a);
        for(let i=0;i<b.length;i++){
          this.array.push({
          Portada:b[i].Portada,
          Nombre:b[i].Nombre,
          Codigo:b[i].Codigo,
          Libro:b[i].Libro,
          Autor:b[i].Autor,
          Sinopsis:b[i].Sinopsis
            }
          )
        }
    });
  }

  ngOnInit(): void {

  }

  ir(comp){

 
        localStorage.setItem("libro",String(comp));
        this.router.navigate(["/visor"]);
        return
      

  }

  eliminar(comp){
    
    this.api.eliminarBiblioteca(comp).subscribe(l=>{
      let a=JSON.stringify(l);
      let b=JSON.parse(a);
      if(b.status==100){
        this.toastr.warning("Se ha quitado el libro de tu biblioteca");
        this.actualizar()
      }
    })
  }

  actualizar(){
    this.router.navigate(["/favoritos"])
  }

  agregar(comp){
    this.api.addFavorite(comp,"1").subscribe(l=>{
      let a=JSON.stringify(l);
      let b=JSON.parse(a);
      if(b.status==100){
        this.toastr.success("Se ha añadido este libro a tus favoritos");
        this.actualizar()
      }
    })
  }
}
