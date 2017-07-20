import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import {StrollerServiceProvider} from '../../providers/stroller-service/stroller-service';
import {ErrorDialogProvider} from '../../providers/error-dialog/error-dialog';


class SystemStatus{
  status: string;

  constructor(){}
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [StrollerServiceProvider]
})

export class HomePage {

  statusData: SystemStatus;
  statusInfo: {};

  constructor(public navCtrl: NavController,
              public strollerService: StrollerServiceProvider,
              public errorService: ErrorDialogProvider,
              public loaderController: LoadingController) {
    this.getStatusInfo(null);
    this.refresh();
  }

  takePhoto(){
    console.log("PHOTO!");
  }

  getStatusInfo(status: string){

    let statusInfo = {
      title: "",
      color: "black"
    };

    switch(status){
      case "ready":
        statusInfo.title = "GOTOWY";
        statusInfo.color = "green";
        break;
      case "busy":
        statusInfo.title = "ZAJĘTY";
        statusInfo.color = "red";
        break;
      default:
        statusInfo.title = "NIEZNANY";
        statusInfo.color = "gray";
        break;
    }

    this.statusInfo = statusInfo;
  }

  refresh(){
    let loader = this.loaderController.create({
      content: "Connecting..."
    });
    loader.present().then(value => {

      this.strollerService.getStatus().then(data => {
        console.log(data);
        this.statusData = <SystemStatus> data;
        this.getStatusInfo(this.statusData.status);
        loader.dismiss();
      }, error => {
        loader.dismiss();
        this.errorService.showError(error);
      });
    });
  }
}
