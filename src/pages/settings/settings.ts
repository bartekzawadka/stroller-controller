import { Component } from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {SettingsConnectionPage} from "../settings-connection/settings-connection";
import {ErrorDialogProvider} from "../../providers/error-dialog/error-dialog";
import {StrollerServiceProvider} from "../../providers/stroller-service/stroller-service";
import {StrollerSettings} from "../../models/stroller-settings";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settings: StrollerSettings = new StrollerSettings();
  configurationEnabled: boolean = false;

  constructor(public navCtrl: NavController, public loaderController: LoadingController,
              public errorService: ErrorDialogProvider, public strollerService: StrollerServiceProvider) {

  }

  ionViewDidEnter(){
    let loader = this.loaderController.create({
      content: "Loading device configuration..."
    });
    loader.present().then(value => {

      this.getDirections().then(()=>{
        this.strollerService.fetchConfiguration().then(value => {

          this.settings.direction = value.direction;
          this.settings.stepAngle = value.stepAngle;
          this.configurationEnabled = true;
          loader.dismiss();
        }, reason=> {
          this.configurationEnabled = false;
          loader.dismiss();
          this.errorService.showError(reason);
        });
      }, error => {
          this.configurationEnabled = false;
          loader.dismiss();
          this.errorService.showError(error);
      });
    });
  }

  saveSettings(){
      this.strollerService.sendConfiguration(this.settings).then(()=>{
        this.errorService.showInfo("Completed", "Configuration updated successfully");
        this.navCtrl.pop();
      }, reason => {
        this.errorService.showError(reason);
      });
  }

  getDirections(){
    return new Promise((resolve, reject) => {
      if(!this.settings.directions || this.settings.directions.length == 0){
        this.strollerService.getDirections().then(value => {
          this.settings.directions = value;
          resolve();
        }, reason => {
          reject(reason);
        });
      }else{
        resolve();
      }
    });
  }

  openConnectionSettings(){
    this.navCtrl.push(SettingsConnectionPage);
  }
}
