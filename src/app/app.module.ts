import {NgModule, ErrorHandler} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler, AlertController} from 'ionic-angular';
import {IonicStorageModule} from "@ionic/storage";
import { MyApp } from './app.component';

import { SettingsPage } from '../pages/settings/settings';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { SettingsConnectionPage} from '../pages/settings-connection/settings-connection'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StrollerServiceProvider } from '../providers/stroller-service/stroller-service';
import { HttpModule, XHRBackend, RequestOptions} from '@angular/http';
import { ErrorDialogProvider } from '../providers/error-dialog/error-dialog';
import { SettingsProvider } from '../providers/settings-provider/settings-provider';
import { HttpInterceptor } from '../providers/http-interceptor/http-interceptor';


@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    HomePage,
    TabsPage,
    SettingsConnectionPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      mode: 'ios'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    HomePage,
    TabsPage,
    SettingsConnectionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StrollerServiceProvider,
    ErrorDialogProvider,
    SettingsProvider,
    {
      provide: HttpInterceptor,
      useFactory: (backend: XHRBackend, options: RequestOptions, errorService: ErrorDialogProvider) => {
        return new HttpInterceptor(backend, options, errorService);
      },
      deps: [XHRBackend, RequestOptions, ErrorDialogProvider, AlertController]
    }
  ]
})
export class AppModule {}
