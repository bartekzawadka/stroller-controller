import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {SettingsConnectionPage} from "../settings-connection/settings-connection";
import {ErrorDialogProvider} from "../../providers/error-dialog/error-dialog";
import {StrollerServiceProvider} from "../../providers/stroller-service/stroller-service";
import {StrollerSettings} from "../../models/stroller-settings";
import {SettingsProvider} from "../../providers/settings-provider/settings-provider";
import {KeyValueItem} from "../../models/key-value-item";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settings: StrollerSettings = new StrollerSettings();
  configurationEnabled: boolean = false;

  constructor(public navCtrl: NavController, public loaderController: LoadingController,
              public errorService: ErrorDialogProvider, public strollerService: StrollerServiceProvider,
              public settingsProvider: SettingsProvider) {

  }

  ionViewDidEnter() {
    let loader = this.loaderController.create({
      content: "Loading device configuration..."
    });
    loader.present().then(value => {

      this.getDirections().then(() => {
        this.strollerService.fetchConfiguration().then(value => {

          this.settings.direction = value.direction;
          this.settings.stepAngle = value.stepAngle;

          let cameras = [];
          cameras.push(new KeyValueItem('Local camera', ''));
          if (value.cameras && value.cameras.length > 0) {
            for (let k = 0; k < value.cameras.length; k++) {
              cameras.push(new KeyValueItem<string>(value.cameras[k].toString(), value.cameras[k].toString()));
            }
          }

          this.settings.cameras = cameras;
          this.settings.camera = value.camera;
          this.configurationEnabled = true;

          this.settingsProvider.setStrollerSettings(this.settings);

          loader.dismiss();
        }, reason => {
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

  saveSettings() {
    let loader = this.loaderController.create({
      content: "Updating device configuration..."
    });
    loader.present().then(() => {
      this.strollerService.sendConfiguration(this.settings).then(() => {
        loader.dismiss();
        this.settingsProvider.setStrollerSettings(this.settings);
        this.navCtrl.pop();
      }, reason => {
        loader.dismiss();
        this.errorService.showError(reason);
      });
    })
  }

  getDirections() {
    return new Promise((resolve, reject) => {
      if (!this.settings.directions || this.settings.directions.length == 0) {
        this.strollerService.getDirections().then(value => {
          this.settings.directions = value;
          resolve();
        }, reason => {
          reject(reason);
        });
      } else {
        resolve();
      }
    });
  }
}
