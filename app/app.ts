import {Component, ViewChild} from '@angular/core';
import {Events, NavController} from 'ionic-angular';
import {Platform, Nav, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';

import {SettingsPage} from './pages/settings/settings';
import {SettingsService} from './providers/settings-service/settings-service';


@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [SettingsService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private rootPage: any;

  constructor(private platform: Platform,
              private events: Events,
              protected settingsService: SettingsService) {

    this.settingsService.hasSpecifiedEmail().then((data) => {
      this.rootPage = (data == true) ? TabsPage : SettingsPage;
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      events.subscribe('user.login', (userData) => {
        this.resetRootPage();
      });

    });
  }

  resetRootPage() {
    this.settingsService.hasSpecifiedEmail().then((data) => {
      if (data === true) {
        if (this.rootPage != TabsPage) {
          this.rootPage = TabsPage;
          this.nav.setRoot(TabsPage);
        }
      }
    });
  }
}

ionicBootstrap(MyApp);
