import {Injectable} from '@angular/core';
import {HttpInterceptor} from "../http-interceptor/http-interceptor";
import {Preferences} from "../../models/preferences";
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import {StrollerSettings} from "../../models/stroller-settings";

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SettingsProvider {

  private strollerSettings: StrollerSettings = new StrollerSettings();

  constructor(public http: HttpInterceptor, private storage: Storage) {
  }

  public getPreferences() {

    return new Promise<Preferences>((resolve, reject) => {
        Promise.all([
          this.storage.get('address'),
          this.storage.get('port')
        ]).then(v => {
          let prefs = new Preferences();

          try{
            prefs.address = v[0];
            prefs.port = Number(v[1]);
            resolve(prefs);
          }
          catch (e){
            reject(e);
          }
        }, reason => {
          reject(reason);
        });
    })

  }


  public setPreferences(settings: { address: string, port: number }) {
    return new Promise(((resolve, reject) => {
      if (!settings) {
        resolve();
        return;
      }

      try{
        this.storage.set('address', settings.address);
        this.storage.set('port', settings.port);

        resolve();
      }catch (e){
        reject(e);
      }

    }));
  }

  public getStrollerSettings() {
    return this.strollerSettings;
  }

  public setStrollerSettings(settings: StrollerSettings) {
    this.strollerSettings = settings;
  }
}
