import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { AlertController, isPlatform, LoadingController, ModalController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  isLoading: boolean = false;
  private stop_toast: boolean = false;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) { }


  setLoader() {
    this.isLoading = !this.isLoading;
  }

  showAlert(message: string, header?, buttonArray?, inputs?) {
    this.alertCtrl.create({
      header: header ? header : 'Authentication failed',
      message: message,
      inputs: inputs ? inputs : [],
      buttons: buttonArray ? buttonArray : ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  checkErrorMessageForAlert(error, msg?) {
    if(error?.error?.message) {
      msg = error.error.message;
    }
    this.showAlert(msg);
  }

  async showToast(msg, color, position, duration = 3000) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: duration,
      color: color,
      position: position
    });
    toast.present();
  }

  async toastDismiss(data?) {
    await this.toastCtrl.dismiss(data);
  }

  async showButtonToast(msg, position?) {
    const toast = await this.toastCtrl.create({
      // header: 'Alert',
      message: msg,
      color: 'danger',
      position: position || 'bottom',
      buttons: [
        {
          side: 'end',
          text: 'VERIFY',
          handler: () => {
            this.toastDismiss(true);
          }
        }, {
          side: 'start',
          icon: 'close-circle',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    await toast.present();
    const { data } = await toast.onDidDismiss();
    if(data) return data;
  }

  stopToast() {
    this.stop_toast = true;
  }

  errorToast(msg?, duration = 4000) {
    if(!this.stop_toast) this.showToast(msg ? msg : 'No internet connection', 'danger', 'bottom', duration);
    else this.stop_toast = false;
  }

  checkMessageForErrorToast(error, msg?) {
    if(error?.error?.message) {
      msg = error.error.message;
    }
    this.errorToast(msg);
  }

  successToast(msg) {
    this.showToast(msg, 'success', 'bottom');
  }

  infoToast(msg) {
    this.showToast(msg, 'secondary', 'bottom');
  }

  showLoader(msg?, spinner?) {
    if(!this.isLoading) this.setLoader();
    return this.loadingCtrl.create({
      message: msg,
      spinner: spinner ? spinner : 'bubbles'
    }).then(res => {
      res.present().then(() => {
        if(!this.isLoading) {
          res.dismiss();
        }
      })
    })
    .catch(e => {
      console.log('show loading error: ', e);
    });
  }

  hideLoader() {
    if(this.isLoading) this.setLoader();
    return this.loadingCtrl.dismiss()
    .then(() => console.log('dismissed'))
    .catch(e => console.log('error hide loader: ', e));
  }

  async createModal(options) {
    const modal = await this.modalCtrl.create(options);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data) return data;
  }

  modalDismiss(val?) {
    let data: any = val ? val : null;
    this.modalCtrl.dismiss(data);
  }

  getIcon(title) {
    const name = title.toLowerCase();
    switch(name) {
      case 'home': return 'home-outline';
      case 'work': return 'briefcase-outline';
      default: return 'location-outline';
    }
  }

  checkPlatformForWeb() {
    if(Capacitor.getPlatform() == 'web') return true;
    return false;
  }

  async customStatusbar(primaryColor?: boolean) {
    if(!this.checkPlatformForWeb()) {
      await StatusBar.setStyle({style: primaryColor ? Style.Dark : Style.Light});
      if(isPlatform('android')) await StatusBar.setBackgroundColor({ color: primaryColor ? '#ffffff' : '#ffffff'});
    }
  }

  async takePicture() {
    await Camera.requestPermissions();
    const image = await Camera.getPhoto({
      quality: 90,
      source: CameraSource.Prompt,
      width: 600,
      resultType: CameraResultType.Base64,
      saveToGallery: true
    });
    return image;
  }

  chooseImageFile(event) {
    const files = event.target.files;
    if(files.length == 0) return;
    const mimeType = files[0].type;
    if(mimeType.match(/image\/*/) == null) return;
    const file = files[0];
    return file;
  }

  getBlob(b64Data) {
    let contentType = '';
    let sliceSize = 512;

    b64Data = b64Data.replace(/data\:image\/(jpeg|jpg|png)\;base64\,/gi, '');

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  
}