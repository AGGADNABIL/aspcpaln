import { Component } from '@angular/core';// , LoadingController
import { NavController , ActionSheetController, ToastController, Platform, LoadingController, Loading } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions ,TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
//import { Toast } from '@ionic-native/toast';
//import { DataServiceProvider } from '../../providers/data-service/data-service';
import { LoginPage } from '../login/login';
import { ParametragePage } from '../parametrage/parametrage';

// import {App} from 'ionic-angular';


declare var cordova: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {



  lastImage: string = null;
  loading: Loading;
  products: any[] = [];
  selectedProduct: any;
  productFound:boolean = false;
  public dataScanned;
  // transfert
  imageURI:any;
  imageFileName:any;
  path:string;
  
 
  constructor(private barcodeScanner: BarcodeScanner,
   //public dataService: DataServiceProvider,
    public navCtrl: NavController, 
    private camera: Camera, private transfer: Transfer, private file: File, 
    private filePath: FilePath, public actionSheetCtrl: ActionSheetController, 
    public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController) {
      
      //this.dataService.getProducts().subscribe((response)=> {
         // this.products = response
       //  console.log(response)
         // console.log(this.products);
      //});
     }

     navToParam(){
      this.navCtrl.push(ParametragePage);
     }

     logout(){
      //clear any cached data
      // this.app.getRootNav().setRoot(LoginPage);
      this.navCtrl.setRoot(LoginPage);
      }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Source image",
      buttons: [
        {
          text: "Galerie",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: "Caméra",
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: "Scan",
          handler: () => {
            this.scan();
          }
        },
        {
          text: 'Annuler',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  uploadFile(name) {
    alert("image est :"+name);
    let loader = this.loadingCtrl.create({
      content: "Uploading..."
    });
    loader.present();
    const fileTransfer: TransferObject = this.transfer.create();
  
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: name,
      //chunkedMode: false,
     // mimeType: "image/jpeg",
      mimeType: 'image/jpeg',
      httpMethod : 'post',
      chunkedMode: false,
      headers: {'Content-Type': 'multipart/form-data'}
    }
  
    fileTransfer.upload(this.path+'/'+name, 'https://localhost:8080/upload.php', options)
      .then((data) => {
      console.log(data+" Uploaded Successfully");
      alert('path :'+this.path);
      //this.imageFileName = "https://4288a2db.ngrok.io/upload/"+name //+".jpg"
      alert("success");
      loader.dismiss();
      this.presentToast("Image uploaded successfully");
    }, (err) => {
      console.log(err);
      alert('path :'+this.path);
      alert("error"+JSON.stringify(err));
      loader.dismiss();
      this.presentToast(err);
    });
  }

  scan() {
    this.barcodeScanner.scan().then((data)=> {
        this.dataScanned= data.text;
        alert("code à barre :"+data.text)
    }, (error)=> {
        alert("Scanning failed: " + error);
    });
  }  

  
  
  takePicture(sourceType) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
   
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
     // alert("data directory :"+this.file.dataDirectory)
       if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
         this.filePath.resolveNativePath(imagePath)
           .then(filePath => {
             let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
             let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
             this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
             this.path=correctPath;
             this.uploadFile(this.createFileName());
           });
       } else {
         var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
         var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
         this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
         this.path=correctPath;
         this.uploadFile(this.createFileName());
      }
    }, (err) => {
      this.presentToast("Erreur selection de l'image.");
    });
  }
  private createFileName() {
    var d = new Date(),
    
    n = d.getTime(),
    newFileName =  "IMG_"+n + ".jpg";
    return newFileName;
  }
   
  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    
  this.file.copyFile(namePath, currentName, 'file:///storage/emulated/legacy', newFileName).then(success => {
    this.lastImage = newFileName;

  }, error => {
    this.presentToast('Erreur stockage du fichier.');
  });
    
  }
   
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
   
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage() {
    // Destination URL
    var url = "https://localhost:8080/upload.php";
   
    // File for Upload
    var targetPath = this.pathForImage(this.lastImage);
   
    // File name only
    var filename = this.lastImage;
   
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };
   
    const fileTransfer: TransferObject = this.transfer.create();
   
    this.loading = this.loadingCtrl.create({
      content: 'Chargement...',
    });
    this.loading.present();
   
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
      this.loading.dismissAll()
      this.presentToast('Image charger en succès.');
    }, err => {
      this.loading.dismissAll()
      this.presentToast('Erreur de chargement du fichier.');
    });
  }
}
