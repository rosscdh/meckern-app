import {Component, ViewChild, ElementRef} from '@angular/core';
import {Events, NavController, LoadingController} from 'ionic-angular';
import {Observable} from 'rxjs/Observable';

import { Camera } from 'ionic-native';
import { Geolocation } from 'ionic-native';

import {ReportService} from '../../providers/report-service/report-service';
import {MapsService} from '../../providers/maps-service/maps-service';

import {SnapCreatePage} from '../../pages/snaps/snaps';


@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [ReportService,
              MapsService]
})
export class HomePage {
    map: any;

    public reports: any;

    private base64Image: string;

    private loading: any;

    constructor(private navCtrl: NavController,
                private loadingCtrl: LoadingController,
                private reportService: ReportService,
                private events: Events,
                private mapsService: MapsService) {

      events.subscribe('home.reset_base64Image', () => {
        this.base64Image = null;
      });

    }

    ionViewLoaded(){
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Loading Geography...'
      });
    }

    takePicture(){
      var self = this;
      // var tmpImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAztJREFUWAnVV1tLVFEU/s6ZozLiJbwUZclYalSQo0haPYxESQ9RSUEEZgSVYf0AH8oegp7qLTRDhHooX0JSIrAnS4mhwSspaeV4w9KxvISizpzTXtuOnZkzNmdGZqIFM+69XHt931p77TV7CyCpvZoHQaiGKBTAI3NV2L5MIiArdihKBcofdQh4WJ4Dk9DKwBPh9oQN18uxZCISs/AoNkZHqYsoODGhQClghi1CEvMjFrk2DUSCYUt/2/O02E2wpuxArBStXRpw/HqsDzPLi8hLSceuhFRu75x34f3UsPdaVm+St2Z1Fh8VgweHz6Ms+6C/fwfU5T6/g67pMZy2WFGaWYA45i/VHI8DjXd1JPwSUMGbnN1odHZi0b0SEFRr4Jyf5tMqRxPoc25nPhqOXoElPiUwAUo7RU7gp1qqtX7DMmanwFtoz0ko8kiIjoBacMGmPVSyOgKhOgp13T8n4PcU+IsmMdqMY2l78HKkF6VZBayik/Fq9APavn5CJjvrF7IKWXMTUP+xHUO/T4E/P746wwQKN2egzlaGHna+B2a/YYs5AZXW46i0N6Ikwwr75BBOpO/n5DIbbrI2r/hi+Z0bJiBAQIwo4Xr7M/R+H+fOes5WoXj7Xtia72NF9uDxwDt0nrmF9Lgkw1kwTIAQZ1l7VcFp3v9jAl9YiyVwkj42JzGbjLduw0WowFhKOYMgvgwTCMJnUKb/DwGZVbXssw0eRWa/5n+ucLRJCrMjvVExXIRvJgZR0lLj5fe2oxk/3UtrOipGW/M9fkzXlGzgcA2jou0pOlwjWjUfGyawJLv5Wdd6GJyb1E75+C1rTL7yeW4KNX2tvmo+j0gNZLCueSn7ECxxyToSOgIL7mVuZJaidMahKoq27kZ90UXsS9qmc6Ej0OUa5UYlllydcagKupqRqL61fnQ1ML4wgyespdKt6EVxRUhXMhWAskiBnLTkcJ/k21d0BMjgBuv3JESCFm9UKCDVp68vgT3L1u2xoV7LVRCqJ0q7v8hVGwn0VlvnPUgLx0f0aVMXb/gvwxbhlh2gt1qkhTAZNgtfuMwfipEkoT5OGbaIa7XdkOUjbBvsfDvCnYnVLbdzTIb9Cwt3LnwZdewjAAAAAElFTkSuQmCC';
      // this.base64Image = tmpImage;
      this.base64Image = null;

      Camera.getPicture({
          destinationType: Camera.DestinationType.DATA_URL,
          targetWidth: 640,
          targetHeight: 480
      }).then((imageData) => {
          this.loading.present();

          // imageData is a base64 encoded string
          this.base64Image = "data:image/jpeg;base64," + imageData;

          this.mapsService.getCurrentGeoLocation().then((coordinates) => {
            this.navCtrl.push(SnapCreatePage, {
              coordinates: coordinates,
              base64Image: self.base64Image
            });
          });

      }, (err) => {
          console.log(err);
      });
    }
}
