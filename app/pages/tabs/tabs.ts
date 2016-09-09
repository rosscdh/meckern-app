import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {MySnapsPage, SnapsAroundMePage} from '../snaps/snaps';
import {SettingsPage} from '../settings/settings';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tabs_list: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tabs_list = [{'page': HomePage, 'title': 'Snap', 'icon': 'aperture'},
                      {'page': SnapsAroundMePage, 'title': 'Snaps Around Me', 'icon': 'md-map'},
                      {'page': MySnapsPage, 'title': 'My Snaps', 'icon': 'microphone'},
                      {'page': SettingsPage, 'title': 'Settings', 'icon': 'settings'}];
  }
}
