import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

class Settings{
  stroller: Stroller;
}

class Stroller{
  address: string;
  port: number;

  constructor(public addr:string, public por:number){
    this.address = addr;
    this.port = por;
    console.log(this.address);
  }
}

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settings: Settings;

  constructor(public navCtrl: NavController) {
    this.settings = new Settings();
    this.settings.stroller = new Stroller("192.168.1.112", 4000);
  }

}
