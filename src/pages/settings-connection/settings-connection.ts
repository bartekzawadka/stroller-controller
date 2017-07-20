/**
 * Created by barte_000 on 2017-07-13.
 */
import { Component } from '@angular/core';
import {NavController, Navbar} from "ionic-angular";
import {ViewChild} from "@angular/core"
import { Platform } from 'ionic-angular';
import {ErrorDialogProvider} from '../../providers/error-dialog/error-dialog';
import {StrollerServiceProvider} from "../../providers/stroller-service/stroller-service";
import {SettingsProvider} from "../../providers/settings-provider/settings-provider";
import {Preferences} from "../../models/preferences";

@Component({
  selector: 'page-settings-connection',
  templateUrl: 'settings-connection.html'
})
export class SettingsConnectionPage {

  private preferences: Preferences = new Preferences();

  constructor(public platform: Platform,
              public navCtrl: NavController,
              public errorService: ErrorDialogProvider,
              public strollerService: StrollerServiceProvider,
              public settingsService: SettingsProvider) {


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

}
