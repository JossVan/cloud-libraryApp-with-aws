import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private path:string;
  constructor(private httpClient:HttpClient) {
    this.path="http://localhost:8080/"
   }

   
}
