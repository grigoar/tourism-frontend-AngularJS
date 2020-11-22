import {AfterViewInit, Component, OnInit} from '@angular/core';
//import * as L from 'leaflet';
import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
declare let L;
declare let L1;
import {Map} from 'leaflet';


import {Router} from "@angular/router";
import {of} from "rxjs/index";
import {City} from "../../model/city";
import {CityService} from "../../services/cities.service";
import {AuthService} from "../../services/auth.service";
import {TokenStorageService} from "../../services/token-storage.service";
// import '~leaflet/dist/leaflet.css';


/* You can add global styles to this file, and also import other style files */
// import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-map',
  templateUrl: './map-home.component.html',
  styleUrls: ['./map-home.component.css']
})

export class MapHomeComponent implements OnInit {
  cities: City[] = [];
  displayedColumns: string[] = ['Name', 'Country', 'ID', 'Lat', 'Lon'];
  citylen: number;
  i: number;
  entry: any;
  //marker: any;
  city: City = null;

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  id: number;

  constructor(private router: Router, private cityService: CityService, private loginService:AuthService, private tokenStorageService: TokenStorageService) {
  }
  // ca si centru temporar Salzburg 47.8095, 13.0550
// Sibiu 45.7983, 24.1256
  // Cluj 46.7712, 23.6236
  // Bistrita 47.1393, 24.4891
  // Bucuresti 44.4268, 26.1025
  // Paris 48.8566, 2.3522
  // Sofia 42.6977, 23.3219
  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.id = user.id;

    }

    this.cityService.getCities()
      .subscribe(data => {
        this.cities = data;
        this.onMap();
      });

}
  onMap() {
    const marker = [];
    const popup = [];
    const latC = 46.7712;
   // const map = L.map('map').setView([47.8095, 13.0550], 5);
    let littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
      denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
      aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
      golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
   // let citieslayer = L.layerGroup([littleton, denver, aurora, golden])
    let hotelslayer = L.layerGroup([littleton, denver, aurora, golden])
   let citiescollection = [];
    let citieslayer = L.layerGroup(citiescollection);
   // let citieslayer;

    const terrain = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
      layers: 'TOPO-OSM-WMS'
    });
    const grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      noWrap: true,
      minZoom:2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    const map = L.map('map', {
      center: [47.8095, 13.0550],
      maxZoom:19,
      minZoom:2,
      noWrap:true,
      zoom: 5,
      scrollWheelZoom: false,
      layers: [terrain,citieslayer]
    });


    var corner1 = L.latLng(40.712, -74.227),
      corner2 = L.latLng(40.774, -74.125),
      bounds = L.latLngBounds(corner1, corner2);


    var baseMaps = {
      "Streets": grayscale,
      "Landscape": terrain
    };
    var overlayMaps = {
      "Cities": citieslayer
    };

    L.control.layers(baseMaps,overlayMaps).addTo(map);
    // const markerCluj = L.marker([46.7712, 23.6236]).addTo(map);
  //  const markerCluj = L.marker([latC, 23.6236]).addTo(map);
   // const markerSibiu = L.marker([45.7983, 24.1256]).addTo(map);
 //   const markerBucuresti = L.marker([44.4268, 26.1025]).addTo(map);
 //   const markerParis = L.marker([48.8566, 2.3522]).addTo(map);
  /*  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      noWrap: true,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);*/



    //test pentru alta vizualizare a hartii
    //The preceding code loads the landscape tile layer. To use another layer, just replace landscape in the URL with cycle, transport, or outdoors.
  /*  L.tileLayer('http://{s}.tile.thunderforest.com/atlas/{z}/{x}/{y}.png').addTo(map);*/

    /*L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
      layers: 'TOPO-OSM-WMS'
    }).addTo(map);*/

    //pentru directii -punct plecare->punct destinatie
    /* L.Routing.control({
     waypoints: [
     // my location 46.7541196,23.5585341
     //cluj 46.7712° N, 23.6236° E
     L.latLng(46.7541196,23.5585341),
     //bistrita 47.1393° N, 24.4891° E
     L.latLng(47.13, 24.48)
     ]
     }).addTo(map);*/

/*    function onParisMapClick(e) {
      //alert("You clicked the map at " + e.latlng);
      // '_self' deschidere in acelasi tab
      window.open('http://localhost:4200/city/4', '_self');
      //this.router.navigate(['login']);
    }

    markerParis.on('click', onParisMapClick);

    function onClujMapClick(e) {
      window.open('http://localhost:4200/city/1', '_self');
    }
    markerCluj.on('click', onClujMapClick);

    function onSibiuMapClick(e) {
      window.open('http://localhost:4200/city/3', '_self');
    }
    markerSibiu.on('click', onSibiuMapClick);

    function onBucurestiMapClick(e) {
      window.open('http://localhost:4200/city/2', '_self');
    }
    markerBucuresti.on('click', onBucurestiMapClick);
   */ //const map1 = L1.map('map1').setView([47.8095, 13.0550], 7);
    this.citylen = this.cities.length;
    /*for (this.i = 0; this.i < this.citylen; this.i++) {

      console.log('luncgime' + this.cities[this.i]);

    }*/

    for ( this.entry of this.cities) {
      // console.log(this.entry.lat);
     /*  console.log(this.entry);
      this.marker = L.marker([this.entry.lat, this.entry.lon]).addTo(map);
      this.marker.id = this.entry.id;
      this.marker.on('click', onMapClick);

      console.log(this.marker);*/
    }

    for (let i = 0; i < this.cities.length; i++) {
      // experimente
     /* popup[i] = L.popup()
        .setLatLng([this.cities[i].lat, this.cities[i].lon])
        .setContent('' + this.cities[i].name)
        .openOn(map);*/
      // console.log(this.entry);
     // console.log(this.marker[i]);
      // adaugare popup pt hover si redirect
      marker[i] = L.marker([this.cities[i].lat, this.cities[i].lon],
        {redirect: 'http://localhost:4200/city/' + this.cities[i].id }).bindPopup(this.cities[i].name).openPopup();
      marker[i].addTo(map);
      //this.marker.id = this.entry.id;

      citiescollection[i] = marker[i];

      marker[i].on('click', onMapClick);
     // citieslayer = L.layerGroup(L.marker([this.cities[i].lat, this.cities[i].lon]));
      console.log(marker);
     console.log('luncgime' + this.cities[i].id);

    // afisare popup cand hover cu mouseul
      marker[i].on('mouseover', function(ev) {
        marker[i].openPopup();
      });
     }
    function onMapClick(e)  {
      //alert("You 1clicked the map at " + e.latlng);
      // '_self' deschidere in acelasi tab
      //window.location.href = 'http://localhost:4200/city/' + marker.id ;
      window.open(this.options.redirect, '_self');
      //this.router.navigate(['login']);
      // router.navigate(['login']);
    }

   // map.locate({setView: true, maxZoom: 16});
    /*function onLocationFound(e) {
      const radius = e.accuracy;

      L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

      L.circle(e.latlng, radius).addTo(map);
    }*/
    // map.on('locationfound', onLocationFound);
   /* map.locate();
    function onLocationFound(e) {
      const radius = e.accuracy;
      L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
    }
    map.on('locationfound', onLocationFound);*/

    // adaugare layers
/*

    var overlayMaps = {
      "Cities": citieslayer
    };
    L.control.layers(overlayMaps).addTo(map);
*/


  }


}
