import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Event} from '../../model/event';
import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
declare let L;
import {Map} from 'leaflet';
import {City} from "../../model/city";
import {Hotel} from "../../model/hotel";
import {Restaurant} from "../../model/restaurant";
import {CityService} from "../../services/cities.service";
import {HotelService} from "../../services/hotel.service";
import {RestaurantService} from "../../services/restaurant.service";
import {EventService} from "../../services/event.service";
import {TouristAttraction} from "../../model/touristAttraction";
import {TouristAttractionService} from "../../services/touristAttraction.service";
import {HttpClient} from "@angular/common/http";
import {Image} from "../../model/image";
import {log} from "util";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-city-all',
  templateUrl: './city-all.component.html',
  styleUrls: ['./city-all.component.css']
})

export class CityAllComponent implements OnInit {

  cityimage: Image = null;
  cityImages: Image[] = [];
  url: string;
  city: City = null;
  id: number;
  private sub: any;
  cities: City[] = [];

  hotels: Hotel[] = [];
  displayedColumns: string[] = ['Name', 'Address', 'Details', 'Contact', 'Website', 'HotelPage'];

  restaurants: Restaurant[] = [];
  displayedColumnsRestaurants: string[] = ['Name', 'Address', 'Details', 'Contact', 'Website', 'RestaurantPage'];

  touristAttractions: TouristAttraction[] = [];
  displayedColumnsTouristAttractions: string[] = ['Name', 'Address', 'Details', 'TouristAttractionPage'];

  events: Event[] = [];
  displayedColumnsEvents: string[] = ['Name', 'StartTime', 'Address', 'Details', 'Going', 'Maybe', 'EventPage'];

  // pentru upload images
  title = 'ImageUploaderFrontEnd';
  public selectedFile;
  selectedFiles = [];
  public event1;
  imgURL: any;
  imgURLs = [];
  receivedImageData: any;
  base64Data: any;
  convertedImage: any;

  hotelscollection = [];
  restaurantscollection = [];
  eventsCollection = [];
  touristAttractionCollection = [];

  //pentru verificarea daca utilizatorul este logat
  private rolesuser: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  userid: number;

  constructor(private route: ActivatedRoute, private cityService: CityService, private hotelService: HotelService,
              private restaurantService: RestaurantService, private touristAttractionsService: TouristAttractionService,
              private eventService: EventService, private router: Router,private tokenStorageService: TokenStorageService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.rolesuser = user.roles;

      this.showAdminBoard = this.rolesuser.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.rolesuser.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.userid = user.id;

    }
    /*  const map = L.map('map').setView([47.8095, 13.0550], 5);

     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     }).addTo(map);
     */
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.cityService.getCityById(this.id)
        .subscribe(data => {
          this.city = data;
        });
    });
    // this.hotelService.getHotels()
    //   .subscribe(data => {
    //     this.hotels = data;
    //   });

    // cautare hoteluri din orasul selectat dupa id
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.hotelService.getHotelsFromCity(this.id)
        .subscribe(data => {
          this.hotels = data;
          this.restaurantService.getRestaurantsFromCity(this.id)
            .subscribe(data1 => {
              this.restaurants = data1;
              this.onMap();
            });

        });
    });

    /* // cauta restaurantele din orasul selectat dupa id
     this.sub = this.route.params.subscribe(params => {
     this.id = +params['id'];
     this.restaurantService.getRestaurantsFromCity(this.id)
     .subscribe(data => {
     this.restaurants = data;
     });
     });*/

    // cauta atractiile turistice din orasul selectat dupa id
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.touristAttractionsService.getTouristAttractionsFromCity(this.id)
        .subscribe(data => {
          this.touristAttractions = data;
        });
    });
    // cauta events din orasul selectat dupa id
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.eventService.getEventsFromCity(this.id)
        .subscribe(data => {
          this.events = data;
          console.log("la cat incepe primul event"+this.events[0].start_time);
        });
    });
    /*    this.sub = this.route.params.subscribe(params => {
     this.id = +params['id'];
     this.cityService.getCityImageById(this.id)
     .subscribe(data => {
     this.cityimage = data;
     });
     });*/
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.cityService.getAllCityImagesById(this.id)
        .subscribe(data => {
          this.cityImages = data;
        });
    });

  }

  viewDetailsHotel(id: number): void {
    this.router.navigate(['hotel', id]);
  }

  viewDetailsEvent(id: number): void {
    this.router.navigate(['event', id]);
  }

  viewDetailsRestaurant(id: number): void {
    this.router.navigate(['restaurant', id]);
  }

  viewDetailsTouristAttraction(id: number): void {
    this.router.navigate(['touristAttraction-page', id]);
  }

  onMap() {


    const markerHotels = [];
    const markerRestaurants = [];
    const markerEvents = [];
    const markerTouristAttractions = [];

    const grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      noWrap: true,
      minZoom:2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    const terrain = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
      layers: 'TOPO-OSM-WMS'
    });

    let hotelIcon = L.icon({
      iconUrl: 'assets/leaflet/images/hotel.png',
      iconSize: [30, 30], // size of the icon
      radius: 200
    });
    let restaurantIcon = L.icon({
      iconUrl: 'assets/leaflet/images/foodpin.jpg',
      iconSize: [30, 30], // size of the icon
      radius: 200
    });
    let eventIcon = L.icon({
      iconUrl: 'assets/leaflet/images/event.png',
      iconSize: [30, 30], // size of the icon
      radius: 200
    });
    let touristAttractionIcon = L.icon({
      iconUrl: 'assets/leaflet/images/touristAttraction.png',
      iconSize: [30, 30], // size of the icon
      radius: 200
    });


    // let hotelslayer = L.layerGroup([littleton, denver, aurora, golden])
    //  let citiescollection = [];
    //let hotelscollection = [];
    //let restaurantscollection = [];
    //  let citieslayer = L.layerGroup(citiescollection);
    //let hotelslayer = L.layerGroup(hotelscollection);
    //let restaurantslayer = L.layerGroup(this.restaurantscollection);
    // let citieslayer;


    //search all the hotels and add all their markers to the hotelCollection
    for (let i = 0; i < this.hotels.length; i++) {
      // marker[i] = L.marker([this.cities[i].lat, this.cities[i].lon],
      //   {redirect: 'http://localhost:4200/city/' + this.cities[i].id }).bindPopup(this.cities[i].name).openPopup();
      markerHotels[i] = L.marker([this.hotels[i].lat, this.hotels[i].lon],
        {redirect: 'http://localhost:4200/hotel/' + this.hotels[i].id })
        .bindPopup(this.hotels[i].name);//.openPopup();
      markerHotels[i].setIcon(hotelIcon);
      markerHotels[i].on('click', onMapClick);
      this.hotelscollection.push(markerHotels[i]);
      // afisare popup cand hover cu mouseul
      markerHotels[i].on('mouseover', function (ev) {
        markerHotels[i].openPopup();
      });
    }

    //search all the restaurants and add all their markers to the restaurantCollection
    for (let i = 0; i < this.restaurants.length; i++) {
      markerRestaurants[i] = L.marker([this.restaurants[i].lat, this.restaurants[i].lon],
        {redirect: 'http://localhost:4200/restaurant/' + this.restaurants[i].id })
        .bindPopup(this.restaurants[i].name);//.openPopup();
      markerRestaurants[i].setIcon(restaurantIcon);
      markerRestaurants[i].on('click', onMapClick);
      this.restaurantscollection.push(markerRestaurants[i]);// = markerr[i];
      // afisare popup cand hover cu mouseul
      markerRestaurants[i].on('mouseover', function (ev) {
        markerRestaurants[i].openPopup();
      });
    }

    //search all the events and add all their markers to the eventsCollection
    for (let i = 0; i < this.events.length; i++) {
      markerEvents[i] = L.marker([this.events[i].lat, this.events[i].lon],
        {redirect: 'http://localhost:4200/event/' + this.events[i].id })
        .bindPopup(this.events[i].name);//.openPopup();
      markerEvents[i].setIcon(eventIcon);
      markerEvents[i].on('click', onMapClick);

      this.eventsCollection.push(markerEvents[i]);// = markerr[i];
      // afisare popup cand hover cu mouseul
      markerEvents[i].on('mouseover', function (ev) {
        markerEvents[i].openPopup();
      });
    }

    //search all the touristAttractions and add all their markers to the touristAttractionCollection
    for (let i = 0; i < this.touristAttractions.length; i++) {
      markerTouristAttractions[i] = L.marker([this.touristAttractions[i].lat, this.touristAttractions[i].lon],
        {redirect: 'http://localhost:4200/touristAttraction-page/' + this.touristAttractions[i].id })
        .bindPopup(this.touristAttractions[i].name);//.openPopup();
      markerTouristAttractions[i].setIcon(touristAttractionIcon);
      markerTouristAttractions[i].on('click', onMapClick);

      this.touristAttractionCollection.push(markerTouristAttractions[i]);// = markerr[i];
      // afisare popup cand hover cu mouseul
      markerTouristAttractions[i].on('mouseover', function (ev) {
        markerTouristAttractions[i].openPopup();
      });
    }

    var restaurantsLayer = L.layerGroup(this.restaurantscollection);
    var hotelsLayer = L.layerGroup(this.hotelscollection);
    var eventsLayer = L.layerGroup(this.eventsCollection);
    var touristAttractionLayer= L.layerGroup(this.touristAttractionCollection);

    const map = L.map('map', {
      //center: [47.8095, 13.0550],
      center: [this.city.lat, this.city.lon],
      zoom: 12,
      layers: [grayscale,hotelsLayer]
    });

    var baseMaps = {
      "Streets": grayscale,
      "Landscape": terrain
    };

    var overlayMaps = {
      //"Cities": citieslayer,
      "Hotels": hotelsLayer,
      'Restaurants': restaurantsLayer,
      "Events": eventsLayer,
      "Tourist Attractions": touristAttractionLayer

    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);
    // const markerCluj = L.marker([46.7712, 23.6236]).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      noWrap: true,
      minZoom:2,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


    /*for (let i = 0; i < this.hotels.length; i++) {
     // adaugare popup pt hover si redirect
     marker[i] = L.marker([this.hotels[i].lat, this.hotels[i].lon],
     {redirect: 'http://localhost:4200/city/' + this.hotels[i].id }).bindPopup(this.hotels[i].name).openPopup();
     marker[i].addTo(map);
     //this.marker.id = this.entry.id;

     // citiescollection[i] = marker[i];
     hotelscollection[i] = marker[i];
     marker[i].on('click', onMapClick);
     console.log(marker);
     console.log('luncgime' + this.hotels[i].id);

     // afisare popup cand hover cu mouseul
     marker[i].on('mouseover', function(ev) {
     marker[i].openPopup();
     });
     }*/
    function onMapClick(e) {
      window.open(this.options.redirect, '_self');
    }

    // adaugare layer restaurante
    // Don Pasquale 46.7675168,23.5851681

    /* map.locate();
     function onLocationFound(e) {
     const radius = e.accuracy;
     L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
     }
     map.on('locationfound', onLocationFound);*/


  }

  public  onFileChanged(event) {
    console.log(event);
    /*  this.selectedFile = event.target.files[0];

     // Below part is used to display the selected image
     let reader = new FileReader();
     reader.readAsDataURL(event.target.files[0]);
     reader.onload = (event2) => {
     this.imgURL = reader.result;
     };*/
    if (event.target.files && event.target.files[0]) {
      let filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.selectedFiles[i] = event.target.files[i];
        console.log(this.selectedFiles[i]);
        let reader = new FileReader();

        reader.onload = (event2) => {
          //  console.log(event2.target.result);
          //  this.imgURLs.push(event2.target.result);

          // this.imgURL.push(reader.result);
          // cica push nu este o functie si nu imi arata imaginile cand le selectez
          this.imgURLs[i] = reader.result;
        }

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  // This part is for uploading
  onUpload() {

    let filesAmount = this.selectedFiles.length;
    for (let i = 0; i < filesAmount; i++) {
      const uploadData = new FormData();
      const selectedimg = this.selectedFiles[i];
      uploadData.append('myFile', selectedimg, selectedimg.name);
      console.log(selectedimg.name);

      this.httpClient.post('http://localhost:8080/city/upload/' + this.id, uploadData)
        .subscribe(
          res => {
            console.log(res);
            this.receivedImageData = res;
            this.base64Data = this.receivedImageData.pic;
            this.convertedImage = 'data:image/jpeg;base64,' + this.base64Data;
            location.reload()
          },
          err => console.log('Error Occured duringng saving: ' + err)
        );

    }
  }
//for admins and moderators panel
  addCity(){
    this.router.navigate(['cities/insert']);
  }
  editCity(){
    this.router.navigate(['cities/edit/', this.city.id]);
  }

  removeCity(cityId:number){
    if(confirm('Are you sure you want to delete the '+ this.city.name+" city?")) {
      console.log("City" + cityId + " removed")
      this.cityService.deleteCity(cityId).subscribe(data=>
      this.router.navigate(['/cities']));
    }
  }

  addNewHotel(){
    this.router.navigate(['hotels/add/'+this.id]);
  }
  addNewRestaurant(){
    this.router.navigate(['restaurant/insert/'+this.id]);
  }
  addNewTouristAttraction(){
    this.router.navigate(['touristAttraction-page/add/'+this.id]);
  }
  addNewEvent(){
    this.router.navigate(['event/insert/'+this.id]);
  }
}
