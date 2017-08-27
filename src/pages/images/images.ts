import { Component } from '@angular/core';
import {DateTime, NavController, NavParams} from 'ionic-angular';
import { LoadingController } from "ionic-angular";
import {StrollerServiceProvider} from "../../providers/stroller-service/stroller-service";
import {ErrorDialogProvider} from "../../providers/error-dialog/error-dialog";
import {ImagePage} from "../image/image";

/**
 * Generated class for the ImagesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-images',
  templateUrl: 'images.html',
})
export class ImagesPage {

  private images: [{_id: string, thumbnail: string, createdAt: DateTime}];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loaderController: LoadingController,
              public strollerService: StrollerServiceProvider,
              public errorService: ErrorDialogProvider) {
  }

  refresh(){
    let loader = this.loaderController.create({
      content: "Loading..."
    });

    let me = this;

    loader.present().then(value => {

      this.strollerService.getImages().then(data => {
        me.images = data;
        loader.dismiss();
      }, error => {
        loader.dismiss();
        this.errorService.showError(error);
      });
    });
  }

  ionViewDidLoad() {
    this.refresh();
  }

  openImage(id){
    this.navCtrl.push(ImagePage, {
      id: id
    });
  }

}
