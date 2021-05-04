import { Component, OnInit } from '@angular/core';
import { Interactions } from 'aws-amplify';
import { Router } from '@angular/router';


@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css']
})
export class BotComponent implements OnInit {

  constructor(private router: Router) { }

  conversation: string = '';
  message: string='';

  ngOnInit(): void {
  }
  user:string='';
  nombre:string='';
  fotita:string='';
  etiquetas:string='';
  datos:any;

  formatAMPM(date:any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }    
  
  regresar(){
    this.router.navigate(['/perfil']);
  }

  chatear(who:string,text:string){
   
    var date = this.formatAMPM(new Date());
    
    /**
     * Me -> PicBuddy
     * You -> User
     */

    var divprincipal=document.getElementById("areaMsg");
    if(who == "me"){
      var divclass=document.createElement("div");
      divclass.setAttribute("class","d-flex justify-content-start mb-4");
      var divimg=document.createElement("div");
      divimg.setAttribute("class","img_cont_msg");
      divimg.style.height="40px";
      divimg.style.width="40px";

      var img=document.createElement("img");
      img.setAttribute("class","rounded-circle user_img_msg");
      img.setAttribute("src","../../assets/images/lector.jpg");
      img.style.height="40px";
      img.style.width="40px";
      img.style.border="1px solid #f5f6fa";

      var divcont=document.createElement("div");
      divcont.setAttribute("class","msg_cotainer");
      divcont.style.marginTop="auto";
      divcont.style.marginBottom="auto";
      divcont.style.marginLeft="10px";
      divcont.style.borderRadius="25px";
      divcont.style.backgroundColor="#82ccdd";
      divcont.style.padding="10px";
      divcont.style.position="relative";
      divcont.innerHTML=text;

      var span=document.createElement("span");
      span.setAttribute("class","msg_time");
      span.style.position="absolute";
      span.style.left="0";
      span.style.bottom="-15px";
      span.style.color="white";
      span.style.fontSize="10px";
      span.innerText=date;

      divcont.appendChild(span);
      divimg.appendChild(img);
      divclass.appendChild(divimg);
      divclass.appendChild(divcont);
      
      if(divprincipal != null){
        divprincipal.appendChild(divclass);
      }
      

    }else{

      var divclass2=document.createElement("div");
      divclass2.setAttribute("class","d-flex justify-content-end mb-4");

      var divsend=document.createElement("div");
      divsend.setAttribute("class","msg_cotainer_send");
      divsend.style.marginTop="auto";
      divsend.style.marginBottom="auto";
      divsend.style.marginRight="10px";
      divsend.style.borderRadius="25px";
      divsend.style.backgroundColor="#78e08f";
      divsend.style.padding="10px";
      divsend.style.position="relative";
      divsend.innerHTML=text;

      var span2=document.createElement("span");
      span2.setAttribute("class","msg_time_send");
      span2.style.position="absolute";
      span2.style.right="0";
      span2.style.bottom="-15px";
      span2.style.color="white";
      span2.style.fontSize="10px";
      span2.innerText=date;

      var divcontimg=document.createElement("div");
      divcontimg.setAttribute("class","img_cont_msg");
      var img2=document.createElement("img");
      img2.setAttribute("class","rounded-circle user_img_msg");
      img2.setAttribute("src","../../assets/images/leaf.jpg");
      img2.style.height="40px";
      img2.style.width="40px";
      img2.style.border="1px solid #f5f6fa";

      divcontimg.appendChild(img2);
      divsend.appendChild(span2);
      divclass2.appendChild(divsend);
      divclass2.appendChild(divcontimg);

      if(divprincipal != null){
        divprincipal.appendChild(divclass2);
      }
    }
  }


  async startChat(){
    /**
     * Mensaje inicial
     */
    this.chatear("me",this.message);
    var response;
    response= await Interactions.send("botsito",this.message.toString());
    this.message="";

    /**
     * El botsito responde
     */
   if(response && response.message){
      this.chatear("you",response.message);
    }

    
    if(response && !response.message){
      this.chatear("you","Los cambios han sido agregados! \n Espero platiquemos pronto...!");
      if(response.slots.slotTwo != null || response.slots.slotTwo != undefined){
        const portada={
          portadaLibro:response.slots.slotTwo
        }
        console.log(portada);
  
      }else{
        const info={
          nombre:response.slots.Nombre,
          lugar:response.slots.Lugar,
          cumple:response.slots.Cumple
        }
        console.log(info);
  
      }
      
    }

  }
}
