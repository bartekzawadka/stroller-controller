import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the CameraProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CameraProvider {

  private cameraStarted: boolean = false;

  constructor() {
    if (!window['cordova'] || !window['cordova'].plugins || !window['cordova'].plugins.CameraPlus) {
      throw "Camera plugin is not available";
    }
  }

  startCamera() {
    return new Promise((resolve, reject) => {
      try {
        //resolve();
        window['cordova'].plugins.CameraPlus.startCamera({
          quality: 100,
          correctOrientation: true
        });

        let firstPicCaptured = () =>{
          // Waiting one second for camera to adjust exposure
          setTimeout(() => {
            this.cameraStarted = true;
            resolve();
          }, 1000);
        };

        // Taking first shot - always failed because buffer is null. Filled with data only after "getJpegImage"
        // is called first time;
        window['cordova'].plugins.CameraPlus.getJpegImage(firstPicCaptured, firstPicCaptured);
      }
      catch (e) {
        reject(e);
      }
    });
  }

  stopCamera() {
    return new Promise((resolve, reject) => {
      try {
        window['cordova'].plugins.CameraPlus.stopCamera();
        this.cameraStarted = false;
        resolve();
      } catch (e) {
        reject(e);
      }
    })
  }

  takePicture() {

    return new Promise<string>((resolve, reject) => {

      //resolve('1234');
      let capture = () => {
        window['cordova'].plugins.CameraPlus.getJpegImage(function (image) {
          resolve(image);
        }, function (e) {
          reject(e);
        });
      };

      if (!this.cameraStarted) {
        this.startCamera().then(() => {
          capture();
        }, e => {
          reject('Unable to start camera: ' + e);
        })
      } else {
        capture();
      }
     })

  }
}
