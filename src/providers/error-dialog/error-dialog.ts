import { Injectable } from '@angular/core';
import { AlertController} from 'ionic-angular';
import 'rxjs/add/operator/map';

/*
  Generated class for the ErrorDialogProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ErrorDialogProvider {

  constructor(public alertCtrl: AlertController) {
  }

  showError(message: string, title?: string){
    if(!title){
      title = 'Error';
    }

    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    });
    alert.present();
  }

  // showError(title: string, message: string){
  //   let alert = this.alertCtrl.create({
  //     title: title,
  //     message: message,
  //     buttons: ['OK']
  //   });
  //   alert.present();
  // }

  showInfo(title: string, message: string){
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
