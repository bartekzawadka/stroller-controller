import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from "ionic-angular";
import {StrollerServiceProvider} from "../../providers/stroller-service/stroller-service";
import {ErrorDialogProvider} from "../../providers/error-dialog/error-dialog";
import {PromisesUtil} from "../../utils/promises";
import _ from 'lodash';

/**
 * Generated class for the ImagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-image',
  templateUrl: 'image.html',
})
export class ImagePage {

  private imageId: string;
  imageIndex: number = 0;
  images: string[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loaderController: LoadingController,
              public strollerService: StrollerServiceProvider,
              public errorService: ErrorDialogProvider) {
    this.imageId = navParams.get('id');
  }

  ionViewDidLoad() {
    let loader = this.loaderController.create({
      content: "Loading..."
    });

    let me = this;

    loader.present().then(value => {

      this.strollerService.getImage(me.imageId).then(data => {


        if(!data || !data.chunks || data.chunks.length == 0) {
          loader.dismiss();
          me.errorService.showError("Empty data received!");
          return;
        }

        let imgsData = [];

        new PromisesUtil<void>().processAsync(data.chunks, (item)=>{
          return new Promise<void>((resolve, reject)=>{
            this.strollerService.getChunk(item).then(chunk =>{
              imgsData.push({
                index: chunk.index,
                image: chunk.image
              });
              resolve();
            }, e =>{
              reject(e);
            });
          });
        }).then(()=>{
          loader.dismiss();
          imgsData = _.sortBy(imgsData, 'index');
          this.images = imgsData.map(i => i.image);
        }).catch(e=>{
          loader.dismiss();
          me.errorService.showError(e);
        });
      }, error => {
        loader.dismiss();
        this.errorService.showError(error);
      });
    });
  }
}
