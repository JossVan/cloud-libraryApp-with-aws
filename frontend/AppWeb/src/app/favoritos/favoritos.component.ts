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
  text:string="";
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

  async extraerTexto(comp){
   
    let datos={
      libro:comp
    }
   const traer=await fetch("http://localhost:8000/importar",{
      body:JSON.stringify(datos),
      headers:{
        "Content-Type":"application/json"
      },
      method: "POST"
   });
  const respuesta=await traer.json();
   if (respuesta.status){
     alert("Se trajo el libro local")

     //Se extrae el texto
     const traer2=await fetch("http://localhost:8000/extraer",{
      method: "GET"
   });
  const respuesta2=await traer2.json();
   this.text=respuesta2.texto
   alert(respuesta2.texto)
    let datos2={
      audio:this.text
    }
    const traer3=await fetch("http://localhost:8000/audio",{
      body:JSON.stringify(datos2),
      headers:{
        "Content-Type":"application/json"
      },
      method: "POST"
    });
    const respuesta3=await traer3.json();
    if (respuesta3.status){
      this.array.forEach(elemento=>{
        if (elemento.Libro==comp){
          localStorage.setItem("portada",elemento.Portada)
          this.router.navigate(["/audio"])
        }
      })
      console.log("Se subió a s3")
    }
   }
  }

  async traducir(comp){
    let datos={
      libro:comp
    }
   const traer=await fetch("http://localhost:8000/importar",{
      body:JSON.stringify(datos),
      headers:{
        "Content-Type":"application/json"
      },
      method: "POST"
   });
  const respuesta=await traer.json();
   if (respuesta.status){
     alert("Se trajo el libro local")

     //Se extrae el texto
     const traer2=await fetch("http://localhost:8000/extraer",{
      method: "GET"
   });
  const respuesta2=await traer2.json();
   this.text=respuesta2.texto
   localStorage.setItem("texto",this.text);
   this.router.navigate(["/traduccion"]);
  }

  }
}
