/**
 * Created by barte_000 on 2017-07-13.
 */
import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import { Platform } from 'ionic-angular';
import {ErrorDialogProvider} from '../../providers/error-dialog/error-dialog';
import {SettingsProvider} from "../../providers/settings-provider/settings-provider";
import {Preferences} from "../../models/preferences";
import {StrollerServiceProvider} from "../../providers/stroller-service/stroller-service";

@Component({
  selector: 'page-settings-connection',
  templateUrl: 'settings-connection.html'
})
export class SettingsConnectionPage {

  private preferences: Preferences = new Preferences();

  constructor(public platform: Platform,
              public navCtrl: NavController,
              public errorService: ErrorDialogProvider,
              public settingsService: SettingsProvider,
              public strollerService: StrollerServiceProvider) {


    this.settingsService.getPreferences().then(data => {
      if(data){
        this.preferences = data;
      }
    }, error=>{
      this.errorService.showError(error);
    });
  }

  moveBack() {

    this.settingsService.setPreferences(this.preferences).then(ok =>{
      this.navCtrl.pop();
    }, fail => {
      this.errorService.showError(fail);
    });
  }

  testConnection(){

    let me = this;

    this.settingsService.getPreferences().then(data=>{

      let previousSettings = data;

      this.settingsService.setPreferences(this.preferences).then(ok =>{

        this.strollerService.getStatus().then(() => {
          this.errorService.showInfo("Connected", "Connection established successfully");
        }, reason=>{

          this.errorService.showError(reason, "Connection failed");

          this.settingsService.setPreferences(previousSettings).then(()=>{
            me.preferences = previousSettings;
          }, failure =>{
            this.errorService.showError(failure, "Restoring settings failed");
          });
        });

      }, fail => {
        this.errorService.showError(fail, "Updating settings failed");
      });
    }, error =>{
      this.errorService.showError(error, "Reading settings failure");
    });
  }

}
