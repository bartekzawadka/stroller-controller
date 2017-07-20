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

      this.strollerService.fetchConfiguration().then(ok => {
        console.log('CONFIGURATION FETCHED');
        loader.dismiss();
      }, fail => {
        loader.dismiss();
        this.errorService.showError(fail);
      })
    });
  }

  openConnectionSettings(){
    this.navCtrl.push(SettingsConnectionPage);
  }
}
