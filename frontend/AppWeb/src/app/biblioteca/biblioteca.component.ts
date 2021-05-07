import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-biblioteca',
  templateUrl: './biblioteca.component.html',
  styleUrls: ['./biblioteca.component.css']
})
export class BibliotecaComponent implements OnInit {
  user:any=[]
  array:any[]=[];
  constructor(private api:ApiService,private router:Router) {
    this.user=JSON.parse(localStorage.getItem("usuario"));
    
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
    this.array.forEach(elemento=>{
      if (elemento.Codigo==comp){
        localStorage.setItem("libro",String(elemento.Libro));
        this.router.navigate(["/visor"]);
        return
      }
    })
  }


}
