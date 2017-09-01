import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {HttpInterceptor} from '../http-interceptor/http-interceptor';
import {SettingsProvider} from "../settings-provider/settings-provider"
import {StrollerSettings} from "../../models/stroller-settings";
import {KeyValueItem} from "../../models/key-value-item";
import {StrollerApiRequest} from "./stroller-api-request";

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

  private getApiUri(command: string) : Promise<string> {

    return new Promise<string>((resolve, reject) => {
      if (!command || command == null || command == '') {
        reject('Invalid command');
      }

      this.settingsService.getPreferences().then(settings => {
        if (!settings) {
          reject('Unable to read configuration');
          return;
        }

        if (!settings.address || settings.address == null || settings.address == "") {
          reject('Invalid remote host address');
          return;
        }

        let url = settings.address;
        if (settings.port && settings.port > 0) {
          url += ":" + settings.port;
        }

        if (!command.startsWith('/')) {
          command = '/' + command;
        }
        let uri = 'http://' + url + '/api' + command;

        resolve(uri);
      }, error => {
        reject(error);
      });
    })

  }

  private sendApiGetRequest(apiCommand: string): Promise<any> {
    //return this.sendApiRequest<any>(apiCommand, 'get', undefined);
    let request = new StrollerApiRequest<any>(()=>this.getApiUri(apiCommand), 'get', this.http).map();
    return request.execute();
  }

  fetchConfiguration() {
    let request = new StrollerApiRequest<StrollerSettings>(()=>this.getApiUri('config'),
      'get', this.http).map();
    return request.execute();
  }

  sendConfiguration(settings: StrollerSettings) {

    if(!settings){
      return new Promise<StrollerSettings>((resolve) => {
        resolve();
      });
    }

    let request = new StrollerApiRequest<StrollerSettings>(()=>this.getApiUri('config'),
      'post', this.http);
    request = request.data({
      direction: settings.direction,
      stepAngle: settings.stepAngle
    });
    return request.execute();
  }

  getStatus() {
    return this.sendApiGetRequest('status');
  }

  getDirections() {

    let request = new StrollerApiRequest<Array<KeyValueItem<string>>>(()=>this.getApiUri('directions'),
      'get', this.http).map();
    request = request.success((result, resolve, reject) => {
            if(!result || Object.prototype.toString.call(result) !== '[object Array]'){
              reject("Unable to get directions from device. No data returned");
              return;
            }

            let directions: Array<KeyValueItem<string>> = [];

            for(let k in result){
              if(result.hasOwnProperty(k)) {
                if (result[k].name && result[k].value) {
                  directions.push(new KeyValueItem(result[k].name, result[k].value));
                }
              }
            }

            resolve(directions);
    });
    return request.execute();
  }

  capture() {
    let request = new StrollerApiRequest<any>(()=>this.getApiUri('capture'), 'get', this.http).map();
    request = request.success((result, resolve) => {
        if (result && result.token) {
          this.token = result.token;
        }
        resolve();
    });
    return request.execute();
  }

  cancelCapturing(force: boolean = false) {

    let request = new StrollerApiRequest<any>(()=>this.getApiUri('capture/cancel'), 'post', this.http);
    request = request.data({
      token: this.token,
      force: force
    });
    return request.execute();
  }

  sendImage(image) {

    let request = new StrollerApiRequest<any>(()=>this.getApiUri('image'), 'post', this.http).map();
    request = request.data({
      token: this.token,
      image: image
    });
    return request.execute();
  }

  getLastImage() {
    return this.sendApiGetRequest('image/last');
  }

  getImages() {
    return this.sendApiGetRequest('images');
  }

  getImage(id: string) {
    return this.sendApiGetRequest('image/' + id);
  }

  getChunk(id: string) {
    return this.sendApiGetRequest('chunk/' + id);
  }
}
