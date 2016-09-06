import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

import {SettingsService} from '../../providers/settings-service/settings-service';

@Component({
  templateUrl: 'build/pages/settings/settings.html',
  providers: [SettingsService]
})
export class SettingsPage {
  public email: string;
  public first_name: string;
  public last_name: string;

  constructor(private navCtrl: NavController, private settingsService: SettingsService) {
    this.loadAccountSettings()
  }

  loadAccountSettings(){
    // this.settingsService.account()
    // .then(data => {
    //   this.email = data.email;
    //   this.first_name = data.first_name;
    //   this.last_name = data.last_name;
    // });
    this.email = this.settingsService.email;
    this.first_name = this.settingsService.first_name;
    this.last_name = this.settingsService.last_name;
  }

}
