import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { map } from 'rxjs/add/operator/map';
//import { HttpModule } from '@angular/http';



@Injectable()
export class DataServiceProvider {
   
url:string;
options:string [];

  constructor(public http: HttpClient) {
    console.log('Hello DataServiceProvider Provider');
  }
  getListDetails(){
    return this.http.get('assets/data/products.json');  //.map((response:Response)=>response.json());
  }

  
  
}
