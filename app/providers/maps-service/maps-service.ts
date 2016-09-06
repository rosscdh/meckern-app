import { Injectable } from '@angular/core';
import {Component, ViewChild, ElementRef} from '@angular/core';

import { Geolocation } from 'ionic-native';

declare var google;

@Injectable()
export class MapsService {
    public map: any;
    public coords: any;

    getCurrentGeoLocation() {
      console.log('getCurrentGeoLocation');
        return new Promise(resolve => {
          Geolocation.getCurrentPosition().then((position) => {
            var data = {
              'lat': position.coords.latitude,
              'lon': position.coords.longitude,
              'position': position
            };
            resolve(data);

          }, (err) => {
            console.log(err);
            var data = {
              'lat': null,
              'lon': null,
              'position': null
            };
            resolve(data);
          });

        });
    }

    loadMap(mapElement, lat=null, lon=null) {
        var self = this;

        return new Promise(resolve => {
          let latLng = new google.maps.LatLng(lat, lon);

          let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          }

          self.map = new google.maps.Map(mapElement.nativeElement, mapOptions);
          resolve(self.map);
        });
    }

    addMarker(map, item) {
     
      let marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: {'lat': item.lat, 'lng': item.lon}
      });
     
      var content = '<b>Information!<br/><small>'+ item.display_severity +'</small></b><img src="'+ item.photo +'" border="0" /><p>' + item.comment + '</p>';
     
      var infowindow = new google.maps.InfoWindow({
        content: content
      });

      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
     
    }
}
