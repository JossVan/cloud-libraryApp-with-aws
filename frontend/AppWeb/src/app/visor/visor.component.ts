import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import WebViewer from '@pdftron/webviewer'

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css']
})
export class VisorComponent implements AfterViewInit {

  @ViewChild('viewer') viewerRef!:ElementRef;

  ngAfterViewInit():void{
    let a=localStorage.getItem("libro");
    
    WebViewer({
      path:'../assets/lib',
      initialDoc: 'https://librossemi1.s3.us-east-2.amazonaws.com/'+a
    }, this.viewerRef.nativeElement).then(instance=>{
      
    })
  }
}

