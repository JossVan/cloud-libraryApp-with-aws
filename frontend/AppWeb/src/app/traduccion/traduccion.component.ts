import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-traduccion',
  templateUrl: './traduccion.component.html',
  styleUrls: ['./traduccion.component.css']
})
export class TraduccionComponent implements OnInit {

  constructor(private api:ApiService,private toastr:ToastrService) { }
  seleccion:string;
  contenido:string;

  ngOnInit(): void {

  }

  traducir(){
    let idioma=""
    let texto=localStorage.getItem("texto");
    if(this.seleccion=="Español"){
      idioma="esp"
    }else if(this.seleccion=="Inglés"){
      idioma="en"
    }else if(this.seleccion=="Alemán"){
      idioma="de"
    }else if(this.seleccion=="Italiano"){
      idioma="it"
    }else if (this.seleccion=="Francés"){
      idioma="fr"
    }
    this.api.traduccion(idioma,texto).subscribe(l=>{
      let a=JSON.parse(JSON.stringify(l));
      this.contenido=a.TranslatedText;
      this.toastr.success("Se ha traducido exitosamente a "+idioma)
    })
  }
}
