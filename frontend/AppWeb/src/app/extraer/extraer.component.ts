import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api.service';

interface HtmlInputEvent extends Event{
  target:HTMLInputElement & EventTarget;
}
@Component({
  selector: 'app-extraer',
  templateUrl: './extraer.component.html',
  styleUrls: ['./extraer.component.css']
})
export class ExtraerComponent implements OnInit {
  pic:File;
  file:File;
  photoSelected: string|ArrayBuffer|null;
  imagen:string;
  nuevap:string;
  bool:boolean=false;
  urlim:string |ArrayBuffer|null;
  texto:string=""
  constructor(private router:Router, private toastr:ToastrService, private api:ApiService) { }

  ngOnInit(): void {
  }
  onPhotoSelected(event:any):void{
    
    if(event.target.files && event.target.files[0]){
      this.file=<File>event.target.files[0];
      const reader=new FileReader();
      reader.onload=e=>this.photoSelected=reader.result;
      reader.readAsDataURL(this.file);
      reader.onloadend =e=>this.urlim=reader.result; 
    }
  }


  public analizarFoto(){
    const input = (<HTMLInputElement>document.getElementById('fotita')).files[0];
    if(this.urlim!=undefined){
      var split=String(this.urlim).split(",",2);
      this.imagen=split[1]
      this.api.extraerTexto(this.imagen).subscribe(result=>{
        let r=JSON.stringify(result);
        let a =JSON.parse(r)
        
        for(let i=0;i<a.texto.length;i++){
          this.texto+=a.texto[i].DetectedText+" ";
        }
        if(a.texto.length>0){
          this.toastr.success("Se ha extraído el texto exitosamente...")
        }else{
          this.toastr.info("No hay texto por analizar")
        }
      })

    }else{
      this.toastr.error('Error','Debe seleccionar una imagen');
    }

  }
  public irRegresar(){
    this.router.navigate(['/perfil'])
  }

  public irChat(){
    var dat={
      componente:"subirfoto"
    }
    localStorage.setItem("componente",JSON.stringify(dat));
    this.router.navigate(['/chat'])
  }


}
