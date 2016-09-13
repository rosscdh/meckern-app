import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage, SqlStorage, ToastController } from 'ionic-angular';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';


let STORAGE = new Storage(SqlStorage);

let data = [],
    SERVER_URL = 'https://712f0f33.ngrok.io',
    tokenURL = SERVER_URL + '/api/v1/token/',
    accountSettingsURL = SERVER_URL + '/api/v1/account/';


@Injectable()
export class SettingsService {
  public token: any;
  public data: any;
  public showDetails: boolean;

  public email: string;
  public first_name: string;
  public last_name: string;

  private toast: any;
  
  constructor(private http: Http,
              private toastCtrl: ToastController) {

      this.toast = this.toastCtrl.create({
        message: null,
        duration: 3000,
        position: 'top'
      });

      this.http = http;
      this.showDetails = false;
      this.data = null;
  }

  hasSpecifiedEmail() {
    return new Promise(resolve => {
      this.account().then(data => {
        resolve(data['email'] !== undefined && data['email'].indexOf('@') >= 0);
      });
    });
  }

  account() {
    return new Promise(resolve => {
      STORAGE.get('account').then((data) => {

        if (data != null) {
          this.data = JSON.parse(data);
          this.email = this.data['email'];
        } else {
          this.email = null;
          this.data = {};
        }
        resolve(this.data);
      });
    });
  }

  saveAccount(data) {
    return new Promise(resolve => {
      var stringify_data = JSON.stringify(data);
      this.toast.message = 'User Saved';
      this.toast.present();
      STORAGE.set('account', stringify_data);
      resolve(data);
    });
  }

  handleError(error) {
      console.error(error);
      return Observable.throw(error.json().error || 'Server error');
  }
 
}