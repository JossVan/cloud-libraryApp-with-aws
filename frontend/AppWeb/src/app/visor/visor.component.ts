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
    WebViewer({
      path:'../assets/lib',
      initialDoc:'https://pdftron.s3.amazonaws.com/downloads/pl/webviewer-demo.pdf'
    }, this.viewerRef.nativeElement).then(instance=>{
      
    })
  }
}
