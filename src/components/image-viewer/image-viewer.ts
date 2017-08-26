import {Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

declare let $;

/**
 * Generated class for the ImageViewerComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'image-viewer',
  templateUrl: 'image-viewer.html',
})

export class ImageViewerComponent {

  @Input('images') set images(value: string[]){
    if(value != this._images){
      this._images = value;
      this.init();
    }
  }

  @ViewChild('imageViewerWrapper')
  ivWrapper: ElementRef;

  private _images: string[];
  private wthRatio: number = 1280*(1.0)/720;

  imageWidth: number = 300;
  imageHeight: number = 300;

  constructor(private screenOrientation: ScreenOrientation) {
    this.screenOrientation.onChange().subscribe(
      () => {
        this.resize();
      }
    );
  }

  init(){

    if(!this._images || this._images == null){
      return;
    }

    let me = this;

    let img = new Image();
    img.onload = ()=>{
      me.wthRatio = img.width/img.height;
      me.imageWidth = img.width;
      me.imageHeight = img.height;

      me.resize();

      let container = $('.imageViewerContainer');
      container.ThreeSixty({
        totalFrames: this._images.length,
        currentFrame: 1,
        width: "100%",
        height: "100%",
        imgArray: this._images,
        progress: '.spinner',
        imgList: '.threesixty_images',
        filePrefix: '', // file prefix if any
        ext: '.png', // extention for the assets
      });

    };
    img.src = this._images[0];
  }

  @HostListener('window:resize', ['$event'])
  onResize(event){
    this.resize();
  }

  resize(){

    let imcHeight = this.ivWrapper.nativeElement.clientHeight;
    let imcWidth = this.ivWrapper.nativeElement.clientWidth;
    let windRatio = imcWidth/imcHeight;


    if(this.wthRatio>1 && windRatio>1){
      if(windRatio>= this.wthRatio){
        this.imageWidth = imcHeight*this.wthRatio;
        this.imageHeight = window.innerHeight;
      }else{
        this.imageWidth = window.innerWidth;
        this.imageHeight = (1.0/this.wthRatio)*imcWidth;
      }
    }else if(this.wthRatio>1 && windRatio<=1){
      this.imageWidth = window.innerWidth;
      this.imageHeight = (1.0/this.wthRatio)*imcWidth;
    }else if(this.wthRatio<=1 && windRatio>1){
      this.imageWidth = imcHeight*this.wthRatio;
      this.imageHeight = window.innerHeight;
    }else {
      if(this.wthRatio<=windRatio){
        this.imageWidth = imcHeight*this.wthRatio;
        this.imageHeight = window.innerHeight;
      }else{
        this.imageWidth = window.innerWidth;
        this.imageHeight = (1.0/this.wthRatio)*imcWidth;
      }
    }

    let imgSelector = $('ol.threesixty_images li img');

    imgSelector.width = this.imageWidth;
    imgSelector.height = this.imageHeight;

    $('.imageViewerContainer').css('width', this.imageWidth);
  }

}
