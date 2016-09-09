import {Component} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Events, NavController} from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';

import {SettingsService} from '../../providers/settings-service/settings-service';

@Component({
  templateUrl: 'build/pages/settings/settings.html',
  providers: [SettingsService],
  directives: [REACTIVE_FORM_DIRECTIVES]
})
export class SettingsPage {
  public data: any;
  public email: string;

  private submitAttempt: boolean;
  private loginForm: FormGroup;

  constructor(private navCtrl: NavController,
              private formBuilder: FormBuilder,
              private settingsService: SettingsService,
              private events: Events) {

    this.loadAccountSettings()
    this.data = {};
    this.email = null;

    this.loginForm = formBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.maxLength(128)])]
    });
  }

  loadAccountSettings(){
    this.settingsService.account().then(data => {
      console.log(data);
      if (data) {
        this.data = data;
        this.email = data['email'];
      }
    });
  }

  onSubmit(formData) {
    var self = this;
    this.submitAttempt = true;
    
    if(formData.valid){
        console.log('success submit')
        this.settingsService.saveAccount(formData.value).then((data) => {
          self.events.publish('user.login', data);
        });
        
    }
    //this.settingsService.saveAccount({'email':this.email});
    
  }

}
