import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , AlertController, LoadingController} from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home'
//import { Network } from '@ionic-native/network';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  resposeData : any;
  loader:any;
  userData = {"username":""};
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
    private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
   
  }
  
  hasValueAny(value: any): value is {} {
    return value !== null && value !== undefined;
  }

  login(){
    //this.navCtrl.push(HomePage);
  //  if (this.userData.username=="admin"){
  //    this.navCtrl.push(HomePage);
  //  }
  
  if(this.authService.isOnline()){
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    setTimeout(() => {
      loader.dismiss();
      this.loader = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
    }, 1000);

    //this.navCtrl.push(TabsPage, {}, {animate: false});
    this.authService.postData(this.userData, "login").then((result) => {
      this.resposeData = result;
      // Hide the loader.
      //loader.dismiss();
      this.loader = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
     
        if (this.hasValueAny(this.resposeData)){ 
        localStorage.setItem('userData', JSON.stringify(this.resposeData));
        this.navCtrl.push(HomePage);
      } else {
        
        let alert = this.alertCtrl.create({
          title: 'utilisateur non valide',
          subTitle: 'Essayer de nouveau!',
          buttons: ['Ok']
        });
        alert.present();
      }
    }, (err) => {
      //loader.dismiss();
      this.loader = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      console.log(err);
    });
  }else{
    let alert = this.alertCtrl.create({
      title: 'Statut de connexion',
      subTitle: "Pas de connexion internet",
      buttons: ['Ok']
    });
    alert.present();
  }
 }
  }

