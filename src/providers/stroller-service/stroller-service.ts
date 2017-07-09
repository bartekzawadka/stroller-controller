import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the StrollerServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StrollerServiceProvider {

  constructor(public http: Http) {
  }

  getStatus(){

    return new Promise((resolve, reject) => {
      this.http.get('http://192.168.1.112:4000/api/status').map(res=>res.json()).subscribe(function(response){
        resolve(response);
      }, function(error){
        reject(error);
      });
    });
  }

}
