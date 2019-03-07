import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {
  Config
} from '../../app/config';

/**
 * Generated class for the InfosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-infos',
  templateUrl: 'infos.html',
})
export class InfosPage {
  public arrayImg: Array < any > ;

  datas: Config[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.datas = [{
        name: 'Nombres de lignes',
        data: 15
      },
      {
        name: 'Nombres de colonnes',
        data: 15
      },
      {
        name: 'PNuméro de pin',
        data: 25
      }
    ];

    this.arrayImg = [
      {
        name: 'Thumbnail1',
        src: '/assets/imgs/thumbnail1.png',
        isChecked : true,
      },
      {
        name: 'Thumbnail2',
        src: '/assets/imgs/thumbnail2.png',
        isChecked : false,
      },
      {
        name: 'Thumbnail3',
        src: '/assets/imgs/thumbnail3.png',
        isChecked : false,
      },
      {
        name: 'Thumbnail4',
        src: '/assets/imgs/thumbnail4.png',
        isChecked : false,
      },
      {
        name: 'Thumbnail5',
        src: '/assets/imgs/thumbnail5.png',
        isChecked : false,
      },
      {
        name: 'Thumbnail6',
        src: '/assets/imgs/thumbnail6.png',
        isChecked : false,
      },
      {
        name: 'Thumbnail7',
        src: '/assets/imgs/thumbnail7.png',
        isChecked : false,
      },
      {
        name: 'Thumbnail8',
        src: '/assets/imgs/thumbnail8.png',
        isChecked : false,
      }
    ];

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfosPage');
  }

  saveData() {

  }

}
