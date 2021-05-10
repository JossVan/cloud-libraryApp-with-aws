import { Component, NgZone, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MediaRecorder } from 'media-recorder-js';
import Amplify from 'aws-amplify';
import {ApiService} from '../services/api.service';
import Predictions, { AmazonAIPredictionsProvider,InterpretTextCategories } from '@aws-amplify/predictions';

declare const navigator: any;
declare const MediaRecorder: any;



@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.css']
})
export class CrearComponent implements OnInit {
  public isRecording: boolean = false;
  private chunks: any = [];
  private mediaRecorder: any;

  constructor(private api:ApiService, private toastr:ToastrService, private zone: NgZone) { 
    var n = <any>navigator;
    n.getUserMedia = (navigator.getUserMedia ||
      n.webkitGetUserMedia ||
      n.mozGetUserMedia ||
      n.msGetUserMedia);
  
    navigator.getUserMedia({ audio: true }, this.onSuccess, e => console.log(e));
  }
  
  user:any;
  array:any[]=[];
  titulo:string="";
  sinopsis:string="";
  contenido:string="";
  seleccion:string="";
  selec:any;
  portada:any;

  ngOnInit(): void {
    this.user=JSON.parse(localStorage.getItem("usuario"));
    this.getHistories();
    
    
    
    
  }
  
  show(){
    this.portada=localStorage.getItem("portada");
    console.log("portada   "+this.portada);
    if(this.portada != null || this.portada!=undefined){
     
      var img=document.getElementById('img');
      
      if(this.portada == "amanecer"){
        img.setAttribute('src','../../assets/amanecer.jpg');
      }else if(this.portada=="bosque"){
        img.setAttribute('src','../../assets/bosque.jpg');
      }else if(this.portada=="cielo"){
        img.setAttribute('src','../../assets/cielo.jpg');
      }else{
        img.setAttribute('src','../../assets/nieve.jpg');
      }
    }
  }
  public onSuccess = stream => {
    this.mediaRecorder = new MediaRecorder(stream);
    this.mediaRecorder.onstop = async e => {
      
      const audio = new Audio();
      /*const blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });*/
      var last_bit= this.chunks[this.chunks.length-1];
      var blob = new Blob([last_bit], { 'type' : 'audio/wav' });
      this.chunks.length = 0;
      audio.src = URL.createObjectURL(blob);
      audio.load();
      audio.play();
      Predictions.convert({
        transcription: {
          source: {
            bytes:blob
          },
          // language: "en-US", // other options are "en-GB", "fr-FR", "fr-CA", "es-US"
        }
      })
      .then(({ transcription: { fullText } }) => console.log({ fullText }))
      .catch(err => console.log({ err }));
      console.log("comprehend");
      /*const data=await Predictions.interpret({
        text: {
          source: {
            text: "text to interpret",
          },
          type: InterpretTextCategories.ALL
        }
      }).then((result) => {console.log(result)})*/
     // fs.createReadStream('C:\Users\i_smi\OneDrive\Escritorio\audio.ogg').pipe(new Throttle(16000 * 2)).pipe(this.transcribeStream)
    };
    this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
  };

  public record() {
    this.isRecording = true;
    this.mediaRecorder.start();
  }

  public stop() {
    this.isRecording = false;
    this.mediaRecorder.stop();
  }

  /*public client = new AwsTranscribe({
   
    accessKeyId: "AKIARF7Z3QHORJDKJQM6",
    secretAccessKey: "JBmBjDc5DUSVZ9g2hm2hfcLiKN419t+cTBO44lGX",
  })*/

  /*public transcribeStream = this.client
    .createStreamingClient({
        region: "eu-west-1",
        sampleRate: 16000,
        languageCode: "en-US",
    })
    // enums for returning the event names which the stream will emit
    .on(StreamingClient.EVENTS.OPEN, () => console.log(`transcribe connection opened`))
    .on(StreamingClient.EVENTS.ERROR, console.error)
    .on(StreamingClient.EVENTS.CLOSE, () => console.log(`transcribe connection closed`))
    .on(StreamingClient.EVENTS.DATA, (data: TranscriptEvent) => {
        const results = data.Transcript.Results

        if (!results || results.length === 0) {
            return
        }

        const result = results[0]
        const final = !result.IsPartial
        const prefix = final ? "recognized" : "recognizing"
        const text = result.Alternatives[0].Transcript
        console.log(`${prefix} text: ${text}`)
    })*/
 


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



