import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Http, Headers  } from '@angular/http';
import { Network } from '@ionic-native/network';
import 'rxjs/add/operator/map';

let apiURL = 'http://localhost:8080/RestApi/';
@Injectable()
export class AuthServiceProvider {

  constructor(public http: HttpClient ,private network: Network//, private headers : Headers
  ) {
    //console.log('Hello AuthServiceProvider Provider');
  }

  isOnline(): boolean {
    //console.log(this.network.type);
    if(this.network.type != 'none'){
      return true;
    } else {
      return false;
    }
  }
  
  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      //let headers = new Headers();
      // console.log('authentication : '+JSON.stringify(credentials) +'  ... '+ type)
      this.http.post(apiURL + type, JSON.stringify(credentials)).subscribe(res => {
        console.log(res);
        resolve(res);
        //this.navCtrl.push(HomePage);
      }, (err) => {
        reject(err);
      });
    });

    
  }

  
}
