import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
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
              public errorService: ErrorDialogProvider) {
    this.getStatusInfo(null);
    this.getStatus();
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

  getStatus(){

    this.strollerService.getStatus().then(data => {
      console.log(data);
      this.statusData = <SystemStatus> data;
      this.getStatusInfo(this.statusData.status);
    }, error => {
      this.errorService.showError(error);
    });
  }
}
