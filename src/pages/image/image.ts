import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from "ionic-angular";
import {StrollerServiceProvider} from "../../providers/stroller-service/stroller-service";
import {ErrorDialogProvider} from "../../providers/error-dialog/error-dialog";
//import * as t from "@types/three";

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
  imageData: [{index: number, image: string}] = [{index: 0, image: null}];
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
        //console.log(data);
        this.imageData = data.image;

        let ii = [];
        for(let k in this.imageData){
          ii.push(this.imageData[k].image);
        }

        this.images = ii;

        loader.dismiss();

  //      this.initThree();

      }, error => {
        loader.dismiss();
        this.errorService.showError(error);
      });
    });
  }
  //
  // initThree(){
  //   let camera = new t.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1100);
  //   //camera.wor = new Vector2(0,0);
  //   camera.lookAt(new t.Vector3(0,0,0));
  //   let scene = new t.Scene();
  //   let geometry = new t.SphereGeometry(500, 60, 0);
  //   geometry.applyMatrix(new t.Matrix4().makeScale(-1,1,1));
  //   let material = new t.MeshBasicMaterial({
  //     map: t.ImageUtils.loadTexture('http://o00o.me/photos/kyiv.jpg')
  //   });
  //
  //   let mesh = new t.Mesh(geometry, material);
  //   scene.add(mesh);
  //   let renderer = new t.WebGLRenderer();
  //   renderer.setPixelRatio(window.devicePixelRatio);
  //   renderer.setSize(window.innerWidth, window.innerHeight);
  //   this.container.appendChild(renderer.domElement);
  //
  // }
}
