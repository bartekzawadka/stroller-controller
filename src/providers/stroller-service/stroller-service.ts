import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpInterceptor} from '../http-interceptor/http-interceptor';
import {SettingsProvider} from "../settings-provider/settings-provider"
import {StrollerSettings} from "../../models/stroller-settings";
import {KeyValueItem} from "../../models/key-value-item";
/*
  Generated class for the StrollerServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class StrollerServiceProvider {

  private token: string;

  constructor(public http: HttpInterceptor, public settingsService: SettingsProvider) {
  }

  private getApiUri(command: string){

    return new Promise<string>((resolve, reject) => {
      if(!command || command == null || command == ''){
        reject('Invalid command');
      }

      this.settingsService.getPreferences().then(settings => {
        if(!settings){
          reject('Unable to read configuration');
          return;
        }

        if (!settings.address || settings.address == null || settings.address == "") {
          reject('Invalid remote host address');
          return;
        }

        let url = settings.address;
        if(settings.port && settings.port>0){
          url +=":"+settings.port;
        }

        if(!command.startsWith('/')){
          command = '/'+command;
        }
        let uri = 'http://'+url+'/api'+command;

        resolve(uri);
      }, error => {
        reject(error);
      });
    })

  }

  private rejectStrollerError(reject: (reason:any)=>void, error: any){
    if(error && error.error){
      reject(error.error);
    }else{
      reject(error);
    }
  }

  fetchConfiguration(){

    let me = this;

    return new Promise<StrollerSettings>((resolve, reject) => {
      this.getApiUri('config').then(uri=>{
        this.http.get(uri).map(res=>res.json()).subscribe(function(response){
          if(!response){
            reject('Unable to get configuration. No data fetched');
            return;
          }

          let settings = new StrollerSettings();
          if(response.direction){
            settings.direction = response.direction;
          }
          if(response.stepAngle){
            settings.stepAngle = response.stepAngle;
          }

          resolve(settings);
        }, function(error){
          me.rejectStrollerError(reject, error);
        });
      }, reason => {
        reject(reason);
      });
    });
  }

  sendConfiguration(settings: StrollerSettings){

    let me = this;

    return new Promise((resolve, reject) => {

      if(!settings){
        resolve();
        return;
      }

      let config: {direction: string, stepAngle: number} = {direction: undefined, stepAngle: undefined};
      if(settings.direction){
        config.direction = settings.direction;
      }
      if(settings.stepAngle){
        config.stepAngle = settings.stepAngle;
      }

      this.getApiUri('config').then(uri=>{
        this.http.post(uri, config).subscribe(function(response){
          resolve();
        }, function(error){
          me.rejectStrollerError(reject, error);
        });
      }, reason => {
        reject(reason);
      });
    });
  }

  getStatus() {

    return new Promise((resolve, reject) => {

      let me = this;

      this.getApiUri('status').then(uri => {
        this.http.get(uri).subscribe(function(response){

          let json: {} = null;
          try{
            json = response.json();
            resolve(json);
          }catch(e){
            reject();
          }
        }, function(error){
          me.rejectStrollerError(reject, error);
        })
      }, reason => {
        reject(reason);
      });

    });
  }

  getDirections(){

    let me = this;

    return new Promise<Array<KeyValueItem<string>>>((resolve, reject) => {
      this.getApiUri('directions').then(uri=>{
        this.http.get(uri).map(res=>res.json()).subscribe(function(response){
          if(!response || Object.prototype.toString.call(response) !== '[object Array]'){
            reject("Unable to get directions from device. No data returned");
            return;
          }

          let directions: Array<KeyValueItem<string>> = [];

          for(let k in response){
            if(response[k].name && response[k].value){
              directions.push(new KeyValueItem(response[k].name, response[k].value));
            }
          }

          resolve(directions);
        }, function (error) {
          me.rejectStrollerError(reject, error);
        })
      }, reason => reject(reason));
    });
  }

  capture(){
    return new Promise<any>((resolve, reject) => {

      let me = this;

      this.getApiUri('capture').then(uri=>{
        this.http.get(uri).map(res=>res.json()).subscribe(function(data){
          if(data.token){
            me.token = data.token;
          }
          resolve();
        }, function (error) {
          me.rejectStrollerError(reject, error);
        })
      }, reason => reject(reason.json()));
    });
  }

  cancelCapturing(){

    let me = this;

    return new Promise<any>((resolve, reject) => {
      this.getApiUri('capture/cancel').then(uri=>{
        this.http.post(uri, {
          token: this.token
        }).subscribe(function(data){
          resolve(data);
        }, function (error) {
          me.rejectStrollerError(reject, error);
        })
      }, reason => reject(reason.json()));
    });
  }

  sendImage(image){

    let me = this;

    return new Promise<any>((resolve, reject) => {
      this.getApiUri('image').then(uri=>{

        let body = {
          token: this.token,
          image: image
        };

        this.http.post(uri, body).map(res=>res.json()).subscribe(function(data){
          resolve(data);
        }, function (error) {
          me.rejectStrollerError(reject, error);
        })
      }, reason => reject(reason.json()));
    });
  }

  getLastImage() {
    let me = this;

    return new Promise<any>((resolve, reject) => {
      this.getApiUri('image').then(uri=>{

        this.http.get(uri).map(res=>res.json()).subscribe(function(data){
          resolve(data);
        }, function (error) {
          me.rejectStrollerError(reject, error);
        })
      }, reason => reject(reason.json()));
    });
  }

  getImages(){
    let me = this;

    return new Promise<any>((resolve, reject) => {
      this.getApiUri('images').then(uri=>{

        this.http.get(uri).map(res=>res.json()).subscribe(function(data){
          resolve(data);
        }, function (error) {
          me.rejectStrollerError(reject, error);
        })
      }, reason => reject(reason.json()));
    });
  }
}
