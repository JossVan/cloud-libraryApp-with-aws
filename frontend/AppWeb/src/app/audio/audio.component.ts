import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit {

  constructor() { }
  portada:string=""
  ngOnInit(): void {
    this.portada=localStorage.getItem("portada");
  }

}
