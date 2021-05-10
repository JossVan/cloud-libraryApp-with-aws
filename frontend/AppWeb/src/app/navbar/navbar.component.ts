import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router:Router, private api:ApiService) { }
  contador:any;
  ngOnInit(): void {
    this.get();
   
  }
  cerrarSesion(){
    localStorage.removeItem('usuario')
    this.router.navigate(['/login'])
  }

  get(){
    const usu=JSON.parse(localStorage.getItem("usuario"));
    this.api.getFavorite(usu.usuario).subscribe(l=>{
      let a=JSON.parse(JSON.stringify(l));
      console.log(a)
      for(let i=0;i<a.msj.length;i++){
        this.contador=i+1
      
      }
    })
  }

}
