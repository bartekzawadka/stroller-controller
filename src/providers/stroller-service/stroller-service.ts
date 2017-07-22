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

  fetchConfiguration(){
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
          reject(error);
        });
      }, reason => {
        reject(reason);
      });
    });
  }

  sendConfiguration(settings: StrollerSettings){
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
          reject(error);
        });
      }, reason => {
        reject(reason);
      });
    });
  }

  getStatus() {

    return new Promise((resolve, reject) => {

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
          reject(error);
        })
      }, reason => {
        reject(reason);
      });

    });
  }

  getDirections(){
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
          reject(error);
        })
      }, reason => reject(reason));
    });
  }
}
