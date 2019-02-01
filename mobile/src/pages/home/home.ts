import { AboutPage } from './../about/about';
import { Component } from '@angular/core';
import { NavController, Platform, LoadingController, ToastController, AlertController, Loading, Alert } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Vibration } from '@ionic-native/vibration';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import * as $ from 'jquery';
import { Subscription, Observable } from 'rxjs/Rx';
import { Insomnia } from '@ionic-native/insomnia';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  checkConnectionSub : Subscription;
  loadingWindow : Loading;
  isInFailureState : Boolean = false;
  isTryingToConnect : Boolean = false;
  popUp : Alert;
  verboseErrors : Boolean = false;  // Useful for debug

  constructor(public navCtrl: NavController,
              public screenOrientation: ScreenOrientation,
              public platform: Platform,
              public vibration: Vibration,
              public loadingCtrl: LoadingController,
              private bluetoothSerial: BluetoothSerial,
              private toastController: ToastController,
              private alertController: AlertController,
              private insomnia:Insomnia) {
      if (this.platform.is('mobile')) {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
        this.platform.pause.subscribe(() => {
          this.freeBluetooth();
        });
        this.insomnia.keepAwake();
      }
  }
  ionViewWillEnter() {
    if (this.platform.is('mobile')) {
      this.connectBluetoothIfNecessary();
    }
  }

  showToast(content: string, timeout: number=4000) {
    let toast = this.toastController.create({
      message: content,
      duration: timeout,
      position: 'top'
    });
    toast.present();
  }

  showAlert(title: string, message: string, openSettings:Boolean = false) {
    let buttons: Array<Object> = [{
      text: 'Réessayer maintenant',
      handler: () => {
        this.isInFailureState = false;
        this.connectBluetoothIfNecessary();
      }
    }];
    
    if(openSettings) {
      buttons.push({
        text: "Ouvrir les paramètres",
        handler: () => {
          this.bluetoothSerial.showBluetoothSettings();
          this.showAlert(title, message, openSettings); // Make sure there's a new alert after opening settings
        },
      });
    }

    this.popUp = this.alertController.create({
      title: title,
      message: message,
      buttons: buttons,
      enableBackdropDismiss: false
    });
    if(this.loadingWindow) this.loadingWindow.dismiss();
    this.popUp.present();
  }
  
  checkBluetoothList(list) {
    let found : boolean = false;
    let macAddress : string;

    list.forEach(element => {
      if(element["name"] == "ARBALET_SAINT_JEAN") {
        found = true;
        macAddress = element["address"];
      }
    });

    if(found) {
      this.bluetoothSerial.connect(macAddress).subscribe(
        () => {
          // Success case
          this.showToast("Vous pouvez maintenant jouer !");
          this.isInFailureState = false;
          if(this.loadingWindow) this.loadingWindow.dismiss();
          if(this.popUp) this.popUp.dismiss();
          // Start the observable to check every second if connect is lost
          this.checkConnectionSub = Observable.interval(1000).subscribe(() => {
            this.connectBluetoothIfNecessary();
          });
        },
        (reason) => { this.raiseConnectionFailureRoutine(true, true, reason); });    
    }
    else {
      this.raiseConnectionFailureRoutine(true, false);
    }
  }
  connectBluetoothIfNecessary() {
    this.bluetoothSerial.isConnected()
    .then().catch(() => {
      this.presentLoadingDefault();
      this.bluetoothSerial.isEnabled().then(() => {
          this.bluetoothSerial.list().then(list => this.checkBluetoothList(list),
                                          reason => this.raiseConnectionFailureRoutine(true, false, reason));
        }).catch(reason => {
          this.bluetoothSerial.enable(); // Don't rely on the result: not supported on iOS
          this.raiseConnectionFailureRoutine(false, false, reason);
        });
    });
  }

  presentLoadingDefault() {
    if(!this.isTryingToConnect) {
      this.loadingWindow = this.loadingCtrl.create({
        content: 'Nous cherchons Arbalet Saint Jean près de vous ...'
      });

      this.loadingWindow.onDidDismiss(() => {
        this.isTryingToConnect = false;
      });

      this.isTryingToConnect = true;  
      this.loadingWindow.present();
    
      setTimeout(() => {
        if(this.isTryingToConnect) {
          // Sanity check, but should naver happen since Bluetooth methods reply fast
          this.raiseConnectionFailureRoutine(false, false, "Connection procedure lasted too long");
        }
      }, 10000);
    }
  }

  raiseConnectionFailureRoutine(isBluetoothEnabled: Boolean, isAssociated: Boolean, reason: string = "") {
    let wasInFailureState = this.isInFailureState;
    this.isInFailureState = true;
    if(this.checkConnectionSub && !this.checkConnectionSub.closed) {
      this.checkConnectionSub.unsubscribe();
    }

    if(!wasInFailureState) {
      let title : string = "";
      let text : string = "";
      let openSettings : Boolean = false;

      if(!isBluetoothEnabled) {
        title = "Bluetooth nécessaire";
        text = "Veuillez activer le Bluetooth dans les paramètres Bluetooth puis réessayer. ";
        openSettings = true;
      }
      else if(!isAssociated) {
        title = "Associez votre smartphone";
        text = "Veuillez vous associer à ARBALET_SAINT_JEAN avec le mot de passe 1234 dans les paramètres Bluetooth puis réessayer. ";
        openSettings = true;
      }
      else {
        title = "Connexion impossible";
        text = "Veuillez vous approcher d'Arbalet Saint Jean puis réessayer. ";
      }

      if(reason != "" && this.verboseErrors) {
        text += "Code d'erreur : " + reason;
      }

      this.showAlert(title, text, openSettings);
    }
  }

  onUp() {
    if (this.platform.is('mobile')) {
      this.bluetoothSerial.write('Up\r\n').then(() => { /* success */ }, () => { this.raiseConnectionFailureRoutine(true, true); });
      this.vibration.vibrate(40);
    }
    $('#upArrow').hide({duration:0, done: function() {$('#upArrow').fadeIn(200);}});
  }
  onDown() {
    if (this.platform.is('mobile')) {
      this.bluetoothSerial.write('Down\r\n').then(() => { /* success */ },  () => { this.raiseConnectionFailureRoutine(true, true); });
      this.vibration.vibrate(40);
    }
    $('#downArrow').hide({duration:0, done: function() {$('#downArrow').fadeIn(200);}});
  }
  onLeft() {
    if (this.platform.is('mobile')) {
      this.bluetoothSerial.write('Left\r\n').then(() => { /* success */ },  () => { this.raiseConnectionFailureRoutine(true, true); });
      this.vibration.vibrate(40);
    }
    $('#leftArrow').hide({duration:0, done: function() {$('#leftArrow').fadeIn(200);}});
  }
  onRight() {
    if (this.platform.is('mobile')) {
      this.bluetoothSerial.write('Right\r\n').then(() => { /* success */ },  () => { this.raiseConnectionFailureRoutine(true, true); });
      this.vibration.vibrate(40);
    }
    $('#rightArrow').hide({duration:0, done: function() {$('#rightArrow').fadeIn(200);}});
  }
  onRotate() {
    if (this.platform.is('mobile')) {
      this.bluetoothSerial.write('Btn1\r\n').then(() => { /* success */ },  () => { this.raiseConnectionFailureRoutine(true, true); });
      this.vibration.vibrate(40);
    }
    $('#rotateArrow').hide({duration:0, done: function() {$('#rotateArrow').fadeIn(200);}});
  }
  onRestart() {
    if (this.platform.is('mobile')) {
      this.bluetoothSerial.write('Select\r\n').then(() => { /* success */ },  () => { this.raiseConnectionFailureRoutine(true, true); });
      this.vibration.vibrate(40);
    }
    $('#restartArrow').hide({duration:0, done: function() {$('#restartArrow').fadeIn(200);}});
  }
  onNext() {
    if (this.platform.is('mobile')) {
      this.bluetoothSerial.write('Start\r\n').then(() => { /* success */ },  () => { this.raiseConnectionFailureRoutine(true, true); });
      this.vibration.vibrate(40);
    }
    $('#nextArrow').hide({duration:0, done: function() {$('#nextArrow').fadeIn(200);}});
  }

  showAbout() {
    this.navCtrl.push(AboutPage);
  }

  freeBluetooth() {
    if(this.bluetoothSerial) {
      this.bluetoothSerial.isConnected().then(() => {
        this.bluetoothSerial.disconnect();
        if(this.checkConnectionSub && !this.checkConnectionSub.closed) {
          this.checkConnectionSub.unsubscribe();
        }
        this.showAlert("Êtes-vous encore là ?", "Vous sembliez occupé, nous avons rendu la main à d'autres joueurs. Voulez-vous vous reconnecter ?", false);
        this.isInFailureState = true;
      });
    }
  }
}
