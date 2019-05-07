import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

//C:\Program Files\Android\Android Studio\gradle\gradle-4.1
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ParametragePage } from '../pages/parametrage/parametrage';
//import { DataServiceProvider } from '../providers/data-service/data-service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AuthServiceProvider } from '../providers/auth-service/auth-service'; 

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ParametragePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ParametragePage
  ],
  providers: [
    StatusBar,
    File,
    Transfer,
    Camera,
    FilePath,
    BarcodeScanner,
    Toast, 
    Network,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
    ,
    //DataServiceProvider,
    AuthServiceProvider
  ]
})
export class AppModule {}
