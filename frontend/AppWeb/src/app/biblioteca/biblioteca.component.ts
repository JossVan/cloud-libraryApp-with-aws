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
  text:string=""
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
