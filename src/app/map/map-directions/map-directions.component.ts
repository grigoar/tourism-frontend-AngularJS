// <reference path="../model/user.ts"/>
import {AfterViewInit, Component, OnInit} from '@angular/core';
// import * as L from 'leaflet';
import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
declare let L;
import {ActivatedRoute, Router} from '@angular/router';
import {Map, map} from 'leaflet';

//import {AuthenticationService} from '../services/authentication.service';
// import '~leaflet/dist/leaflet.css';


/* You can add global styles to this file, and also import other style files */
// import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-map',
  templateUrl: './map-directions.component.html',
  styleUrls: ['./map-directions.component.scss']
})

export class MapDirectionsComponent implements OnInit {

  constructor(private router: Router,
             /* private loginservice: AuthenticationService,*/  private route: ActivatedRoute) {
  }

  // ca si centru temporar Salzburg 47.8095, 13.0550
// Sibiu 45.7983, 24.1256
  // Cluj 46.7712, 23.6236
  // Bistrita 47.1393, 24.4891
  // Bucuresti 44.4268, 26.1025
  // Paris 48.8566, 2.3522
  ngOnInit() {


    const map = L.map('map').setView([47.8095, 13.0550], 6);
    /* const markerCluj = L.marker([46.7712, 23.6236]).addTo(map);
     const markerSibiu = L.marker([45.7983, 24.1256]).addTo(map);
     const markerBucuresti = L.marker([45.7983, 24.1256]).addTo(map);
     const markerParis = L.marker([48.8566, 2.3522]).addTo(map);*/
    L
      .tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        , {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        }
      ).addTo(map);

// pentru directii -punct plecare->punct destinatie
    L.Routing.control({
      waypoints: [
        // my location 46.7541196,23.5585341
        // cluj 46.7712° N, 23.6236° E
        L.latLng(46.7541196, 23.5585341),
        // bistrita 47.1393° N, 24.4891° E
        L.latLng(47.13, 24.48)
      ]
    }).addTo(map);

    function onMapClick(e) {
       //alert("You clicked the map at " + e.latlng);
      // '_self' deschidere in acelasi tab
      window.open('http://localhost:4200/login', '_self');
      //this.router.navigate(['login']);
    }

    map.on('click', onMapClick);
  }
}



