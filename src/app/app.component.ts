import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {HomePage} from "../pages/home/home";
import {SettingsPage} from "../pages/settings/settings";
import {SettingsConnectionPage} from "../pages/settings-connection/settings-connection";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    this.pages = [
      {title: 'Capturing settings', component: SettingsPage, icon: 'ios-options'},
      {title: 'Connection settings', component: SettingsConnectionPage, icon: 'ios-code-working'}
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  openPage(page){
    this.nav.push(page.component);
  }
}
