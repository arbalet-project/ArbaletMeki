import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfosPage } from './infos';

@NgModule({
  declarations: [
    InfosPage,
  ],
  imports: [
    IonicPageModule.forChild(InfosPage),
  ],
})
export class InfosPageModule {}
