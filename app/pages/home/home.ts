import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController} from 'ionic-angular';

import { Camera } from 'ionic-native';
import { CameraPreview } from 'ionic-native';
import { Geolocation } from 'ionic-native';

import {ReportService} from '../../providers/report-service/report-service';
import {MapsService} from '../../providers/maps-service/maps-service';
import {SnapCreatePage} from '../../pages/snaps/snaps';


let CPreviewOptions = {
  x: 0,
  y: 0,
  width: 640,
  height: 480,
  /**
  * Choose the camera to use (front- or back-facing).
  *  'front' for front camera
  *  'rear' for rear camera
  */
  camera: 'rear',
  /** Take photo on tap */
  tapPhoto: true,
  /** */
  previewDrag: true,
  /**  */
  toBack: false,
  /** Alpha use when toBack is set to true */
  alpha: 0
}

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [ReportService, MapsService]
})
export class HomePage {
    @ViewChild('map') mapElement: ElementRef;
    map: any;

    public reports: any;
    public coordinates: any;

    public base64Image: string;
    public showForm: boolean;

    constructor(private navCtrl: NavController, public reportService: ReportService, public mapsService: MapsService) {  
        this.showForm = false;
        this.coordinates = {
          'lat': 51.0718316,
          'lon': 6.4505703,
        };
    }

    ionViewLoaded(){

        CameraPreview.startCamera(CPreviewOptions);
        // //CameraPreview.setOnPictureTakenHandler(receivePicture);
        CameraPreview.show();

        this.loadHomepageMap();
    }

    loadHomepageMap() {
        var self = this;

        this.mapsService.getCurrentGeoLocation().then((data) => {
          console.log('fdasd')
          console.log(data);

          self.coordinates = data;

          this.mapsService.loadMap(this.mapElement,
                                   self.coordinates.lat,
                                   self.coordinates.lon).then((map) => {
            self.map = map;
            this.loadReports(self.map, self.coordinates.lat, self.coordinates.lon);
          });

        });
    }

    loadReports(map, lat=null, lon=null){
      var self = this;

      if (lat !== null && lon !== null) {

        this.reportService.findByGeoLocation(50000, lat, lon).then(
            data => {
              self.reports = data;
              for (var i in data) {
                  var item = data[i];
                  this.mapsService.addMarker(map, item);
              };
            }
        );

      }else{
        // no lat or long
        this.reportService.findAll().then(
            data => {
              self.reports = data;
              for (var i in data) {
                  var item = data[i];
                  this.mapsService.addMarker(self.map, item);
              };
            }
        );
      }
    }


    takePicture(){
        var self = this;
        var tmpImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAztJREFUWAnVV1tLVFEU/s6ZozLiJbwUZclYalSQo0haPYxESQ9RSUEEZgSVYf0AH8oegp7qLTRDhHooX0JSIrAnS4mhwSspaeV4w9KxvISizpzTXtuOnZkzNmdGZqIFM+69XHt931p77TV7CyCpvZoHQaiGKBTAI3NV2L5MIiArdihKBcofdQh4WJ4Dk9DKwBPh9oQN18uxZCISs/AoNkZHqYsoODGhQClghi1CEvMjFrk2DUSCYUt/2/O02E2wpuxArBStXRpw/HqsDzPLi8hLSceuhFRu75x34f3UsPdaVm+St2Z1Fh8VgweHz6Ms+6C/fwfU5T6/g67pMZy2WFGaWYA45i/VHI8DjXd1JPwSUMGbnN1odHZi0b0SEFRr4Jyf5tMqRxPoc25nPhqOXoElPiUwAUo7RU7gp1qqtX7DMmanwFtoz0ko8kiIjoBacMGmPVSyOgKhOgp13T8n4PcU+IsmMdqMY2l78HKkF6VZBayik/Fq9APavn5CJjvrF7IKWXMTUP+xHUO/T4E/P746wwQKN2egzlaGHna+B2a/YYs5AZXW46i0N6Ikwwr75BBOpO/n5DIbbrI2r/hi+Z0bJiBAQIwo4Xr7M/R+H+fOes5WoXj7Xtia72NF9uDxwDt0nrmF9Lgkw1kwTIAQZ1l7VcFp3v9jAl9YiyVwkj42JzGbjLduw0WowFhKOYMgvgwTCMJnUKb/DwGZVbXssw0eRWa/5n+ucLRJCrMjvVExXIRvJgZR0lLj5fe2oxk/3UtrOipGW/M9fkzXlGzgcA2jou0pOlwjWjUfGyawJLv5Wdd6GJyb1E75+C1rTL7yeW4KNX2tvmo+j0gNZLCueSn7ECxxyToSOgIL7mVuZJaidMahKoq27kZ90UXsS9qmc6Ej0OUa5UYlllydcagKupqRqL61fnQ1ML4wgyespdKt6EVxRUhXMhWAskiBnLTkcJ/k21d0BMjgBuv3JESCFm9UKCDVp68vgT3L1u2xoV7LVRCqJ0q7v8hVGwn0VlvnPUgLx0f0aVMXb/gvwxbhlh2gt1qkhTAZNgtfuMwfipEkoT5OGbaIa7XdkOUjbBvsfDvCnYnVLbdzTIb9Cwt3LnwZdewjAAAAAElFTkSuQmCC';
        this.base64Image = tmpImage;
        
        this.navCtrl.push(SnapCreatePage, {
          coordinates: self.coordinates,
          base64Image: self.base64Image
        })
        // Camera.getPicture({
        //     destinationType: Camera.DestinationType.DATA_URL,
        //     targetWidth: 1000,
        //     targetHeight: 1000
        // }).then((imageData) => {
        //   // imageData is a base64 encoded string
        //     this.base64Image = "data:image/jpeg;base64," + imageData;
        //     this.showForm = true;
        // }, (err) => {
        //     console.log(err);
        // });
    }

}
