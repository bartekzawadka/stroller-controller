import { Component } from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {StrollerServiceProvider} from '../../providers/stroller-service/stroller-service';
import {ErrorDialogProvider} from '../../providers/error-dialog/error-dialog';
import {CameraProvider} from "../../providers/camera-provider/camera-provider";
import { ImagesPage} from "../images/images";
import {ImagePage} from "../image/image";

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

  statusData: SystemStatus = new SystemStatus();
  statusInfo: {
    title: string,
    color: string
  };
  isCapturing: boolean = false;
  isCancellationPending: boolean = false;
  capProgress: number = 0;
  capProgressText: string = "0%";
  isShowingImage: boolean = false;

  constructor(public navCtrl: NavController,
              public strollerService: StrollerServiceProvider,
              public errorService: ErrorDialogProvider,
              public loaderController: LoadingController,
              public cameraService: CameraProvider) {
    this.getStatusInfo(null);
  }

  ionViewDidEnter(){
    this.refresh();
  }

  showImages(){
    this.navCtrl.push(ImagesPage);
  }

  cancelCapturing(){

    this.isCancellationPending = true;

      this.strollerService.cancelCapturing().then(()=>{
        this.isCapturing = false;
        this.capProgressText = "0%";
        this.capProgress = 0;
      }, e=>{
        this.errorService.showError(e);
        this.isCapturing = false;
        this.capProgressText = "0%";
        this.capProgress = 0;
      });
  }

  stopCapturing(sendCancel: boolean){
    this.capProgressText = "0%";
    this.capProgress = 0;
    this.isCancellationPending = false;

    let me = this;

    let done = (e) => {
      if(e)
        me.errorService.showError(e, 'Closing camera failed');
      if(sendCancel){
        me.strollerService.cancelCapturing().then(()=>{
          me.isCapturing = false;

        }, e=>{
          me.errorService.showError(e);
        });
      }else{
        me.isCapturing = false;
      }
    };

    me.cameraService.stopCamera().then(done, e => {
      done(e);
    });
  }

  takePhoto(){

    let me = this;

    this.isCapturing = true;
    this.isCancellationPending = false;

    let cameraEstablished = function(){
      me.strollerService.capture().then(()=>{

        let getImage = function() {

          if(me.isCancellationPending){
            return;
          }

          me.cameraService.takePicture().then((image) => {

            image = "data:image/jpeg;base64," + image;

              me.strollerService.sendImage(image).then((data) => {
                if (data.progress) {
                  me.capProgress = data.progress;
                  me.capProgressText = data.progress + "%";
                }

                if (data.hasOwnProperty("status")) {
                  let status = parseInt(data.status);

                  if (status == 0) {
                    //me.errorService.showInfo('Completed', 'Image acquired successfully');
                    me.stopCapturing(false);
                    if(data.id){
                      me.navCtrl.push(ImagePage, {
                        id: data.id
                      });
                    }
                  } else if (status == 1) {
                    getImage();
                  } else {
                    me.errorService.showError("Unknown status: " + status);
                  }
                } else {
                  me.errorService.showError("data.status is undefined!!!");
                }
              }, (ee) => {
                if(!me.isCancellationPending) {
                  me.errorService.showError(ee);
                }
                me.stopCapturing(false);
              })
          }, function (e) {
            me.errorService.showError(e);
            me.stopCapturing(true);
          });
        };

        getImage();

      }, (e)=>{
        me.errorService.showError(e);
        me.stopCapturing(false);
      });
    };

    this.cameraService.startCamera().then(()=>{
      cameraEstablished();
    }, e =>{
      this.errorService.showError(e);
    })
  }

  getStatusInfo(status: string){

    let statusInfo = {
      title: "",
      color: "black"
    };

    switch(status){
      case "ready":
        statusInfo.title = "READY";
        statusInfo.color = "green";
        break;
      case "busy":
        statusInfo.title = "BUSY - ACQUISITION PENDING";
        statusInfo.color = "red";
        break;
      default:
        statusInfo.title = "STATUS UNKNOWN";
        statusInfo.color = "#333";
        break;
    }

    this.statusInfo = statusInfo;
  }

  forceReleaseStroller(){

    let me = this;

    this.errorService.showConfirmation("Device busy",
      "Releasing currently working device may impact result images. Do you want to continue anyway?",
      "Yes").then(()=>{
      this.strollerService.cancelCapturing(true).then(()=>{
        me.isCapturing = false;
        me.refresh();
      }, (e)=>{
        this.errorService.showError(e);
      })
    }, ()=>{});
  }

  refresh(){
    let loader = this.loaderController.create({
      content: "Connecting..."
    });
    loader.present().then(value => {

      this.strollerService.getStatus().then(data => {
        this.statusData = <SystemStatus> data;
        this.getStatusInfo(this.statusData.status);
        loader.dismiss();
      }, error => {
        loader.dismiss();
        this.statusData = undefined;
        this.getStatusInfo(undefined);
        this.errorService.showError(error);
      });
    });
  }
}
