import { Component, OnInit } from '@angular/core';
import {ApiService} from '../services/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public usuario:string="";
  public pass:string=""
  constructor(private api:ApiService) { }

  ngOnInit(): void {
  }

  public login(){
    if(this.usuario=="" || this.pass==""){

    }else{
      this.api.loguearse(this.usuario,this.pass).subscribe(result=>{
        result=JSON.stringify(result);
        let array=JSON.parse(result);
        console.log(array)
      })
    }
  }
}
