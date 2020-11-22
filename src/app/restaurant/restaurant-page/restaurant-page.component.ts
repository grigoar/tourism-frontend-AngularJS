import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';

import {Comment} from '../../model/comment';
import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';

import {log} from 'util';
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {Restaurant} from "../../model/restaurant";
import {User} from "../../model/user";
import {RestaurantService} from "../../services/restaurant.service";
import {UserService} from "../../services/user.service";
import {CommentService} from "../../services/comment.service";
import {TokenStorageService} from "../../services/token-storage.service";
import Chart from 'chart.js';
import {Image} from "../../model/image";
import {HttpClient} from "@angular/common/http";
import {TypeOfFood} from "../../model/typeOfFood";
import {TypeOfFoodService} from "../../services/typeOfFood.service";
import {City} from "../../model/city";
import {CityService} from "../../services/cities.service";
import {Reservation} from "../../model/reservation";
import {ReservationService} from "../../services/reservation.service";

declare let L;

@Component({
  selector: 'app-restaurant-page',
  templateUrl: './restaurant-page.component.html',
  styleUrls: ['./restaurant-page.component.css']
})

export class RestaurantPageComponent implements OnInit {

  comments: Comment[] = [];

  displayedColumnsComments: string[] = ['Details', 'Date', 'Username'];
  currentRate = 3.14;
  restaurant: Restaurant = null;
  id: number;
  private sub: any;
  usercomment: User;
  users: User[] = [];
  displayedColumns: string[] = ['name', 'telephone', 'details'];

  typesOfFood:TypeOfFood[]=[];

  show = false;
  commentsubmitted: any = 'Add comment';

  commentadd: Comment = new Comment();
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  userid: number;
  rating = 0;

  dataForRatingChart = [];
  LineChart = [];
  pointsData = [5, 4, 2, 0 ,0, 5, 2, 3];

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
  restaurantImages:Image[]=[];

  userImage:Image=null;

  // pentru harta
  city:City=null;

  //pentru reservari si butoatne si filtre
  restaurantReservations:Reservation[]=[];
  userReservation:User=null;

  userRestaurantReservations:Reservation[]=[];

  startDate:Date;
  reservationAdd=new Reservation();
  userRestaurantReservationsByDate:Reservation[]=[];

  showReservation=false;
  showHideReservationButton="Add new reservation";

  nrTablesAvailable:number;

  showTypeOfFood=false;
  showHideTypeOfFoodButton="Add new type of food";
  typeOfFoodAdd:TypeOfFood= new TypeOfFood();

  constructor(private route: ActivatedRoute, private restaurantService: RestaurantService, private commentService: CommentService,private userService: UserService, private router: Router, config: NgbRatingConfig, private tokenStorageService: TokenStorageService,private typeOfFoodService:TypeOfFoodService, private cityService: CityService, private httpClient: HttpClient, private reservationService:ReservationService) {
    // customize default values of ratings used by this component tree
    config.max = 5;
    //config.readonly = true;
  }
// Grand hotel italia 46.75584,23.6281856
  ngOnInit() {
   // config.readonly = true;
    this.userService.getUsers()
      .subscribe(data => {
        this.users = data;
      });


    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.restaurantService.getRestaurantById(this.id)
        .subscribe(data => {
          this.restaurant = data;
          this.nrTablesAvailable=this.restaurant.tables;
          this.cityService.getCityById(this.restaurant.city_id)
            .subscribe(data1 => {
              this.city = data1;
              this.onMap();
            });
        });
    });

   // this.userService.getUserById(this.comments.user_id);
    // log('ceva' + this.userService.getUserById(this.comment.user_id));
   // cautare comments pentru restaurantul selectat dupa id
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.commentService.getCommentsFromRestaurant(this.id)
        .subscribe(data => {
          // this.userService.getUserById(this.comments.user_id);
          this.comments = data;

          for(let i=0;i<this.comments.length;i++){
            this.userService.getUserImageById(this.comments[i].user_id)
              .subscribe(data1 => {
                this.userImage = data1;
                this.comments[i].pic=this.userImage.pic;

              });
          }
        });
    });

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.commentService.getCommentsRatingForRestaurant(this.id)
        .subscribe(data => {
          this.dataForRatingChart = data;
          //console.log(this.dataForRatingChart);
          this.constructChart();

        });
    });
    /*this.sub = this.route.params.subscribe(params => {
      this.userid = this.comments.user_id;
      console.log('ceva' + this.comments.user_id );
      this.userService.getUserById(this.id)
        .subscribe(data => {
          this.users = data;
        });
    });*/

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.userid = user.id;

    }

    //get all restaurant images
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.restaurantService.getAllRestaurantImagesById(this.id)
        .subscribe(dataImages => {
          this.restaurantImages = dataImages;
          console.log("functioneaza backendul "+this.restaurantImages[1].pic);
        });
    });

    //get all type of foods from this restaurant
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.typeOfFoodService.getTypeOfFoodFromRestaurant(this.id)
        .subscribe(data => {
          this.typesOfFood = data;
          console.log("cate tipuri de mancare sunt"+ this.typesOfFood.length);

        });
    });


  //get all restaurant reservations
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.reservationService.getAllReservationsFromRestaurantById(this.id)
        .subscribe(data => {
          this.restaurantReservations = data;
          for(let i=0;i<this.restaurantReservations.length;i++){
            this.userRestaurantReservationsByDate[i]=this.restaurantReservations[i];
            this.userReservation=this.restaurantReservations[i].user;
            console.log("functioneaza backendul si rezrvarile cu userul cu emailul: "+this.userReservation.email);
          }

          console.log("functioneaza backendul si rezrvarile cu userul cu emailul: "+this.userReservation.email);
        });
    });

    //get all user reservations
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.reservationService.getUserReservationsRestaurant(this.userid,this.id)
        .subscribe(data => {
          this.userRestaurantReservations = data;
        });
    });
    //end onInit
  }
  viewUserName(id: number): void {
    this.userService.getUserById(id)
      .subscribe(data => {
        this.usercomment = data;
      });

  }


  onSubmit(rating) {
    this.commentadd.rating = rating;
    this.commentadd.restaurant_id = this.id;
     this.commentadd.user_id = this.userid;
    this.commentService.insertComment(this.commentadd)
      .subscribe(data => this.router.navigate(['restaurant/', this.commentadd.restaurant_id]).then(() => {
        window.location.reload();
      } ));
  }
  setValue(val: number) {
    this.commentadd.rating = val;
  }


  addComment(id): void {
    this.router.navigate(['/comment/add/', id]);
  }

//pentru rating statistics
  constructChart(){
    this.LineChart.push( new Chart('lineChart', {
      type: 'line',
      data: {
        // labels: ['July-2020','June-2020','May-2020','April-2020','March-2020','Feb-2020','Jan-2020','Dec-2019','Nov-2019','Oct-2019','Sep-2019','Aug-2019'],
        labels: ['January','February','March','April','May','June','July','August','September','October','November','December'],
        datasets: [{
          label: 'Average month rating',
          data: this.dataForRatingChart,
          fill: false,
          lineTension: 0.5,
          borderColor: 'blue',
          borderWidth: 2
        }]
      },
      options: {
        title: {
          text: 'Average rating per month based on customers feedback',
          display: true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max:5
            }
          }]
        }
      }
    }));
  }

//pt imagini
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

      this.httpClient.post('http://localhost:8080/restaurant/upload/' + this.id, uploadData)
        .subscribe(
          res => {
            console.log(res);
            this.receivedImageData = res;
            this.base64Data = this.receivedImageData.pic;
            this.convertedImage = 'data:image/jpeg;base64,' + this.base64Data;
            location.reload();
          },
          err => console.log('Error Occured duringng saving: ' + err)
        );

    }
  }

  onMap() {

    //  const map = L.map('map').setView([this.hotel.lat, this.hotel.lon], 5);
    //  const markerParis = L.marker([48.8566, 2.3522]).addTo(map);
    let restaurantmarker;

    const map = L.map('map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let greenIcon = L.icon({
      iconUrl: 'assets/leaflet/images/hotel-pin.png',
      iconSize: [19, 47], // size of the icon
      radius: 200
      // shadowSize:   [50, 64], // size of the shadow
      //   iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      //  shadowAnchor: [4, 62],  // the same for the shadow
      //   popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    map.on('zoomed', function () {
      let currentZoom = map.getZoom();
      greenIcon = new L.Icon({
        iconUrl: 'assets/leaflet/images/restaurant-pin.png',
        iconSize: [map.getZoom / 2, map.getZoom / 2],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        radius: 200
      });
      //restaurantmarker.setIcon(greenIcon);
    });



    console.log(this.restaurant.lat + ' ' + this.restaurant.lon);
    map.locate({setView: true, maxZoom: 12});


    function onLocationFound(e) {
      const radius = e.accuracy;
      //  L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
      //  L.marker(e.latlng).addTo(map).bindPopup("Your location");//.openPopup();
      let circle = L.circle(e.latlng, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100
      }).addTo(map).bindPopup("Your location");
      //  this.markerstart = L.marker(e.latlng).bindPopup("Your location");
      //   this.markerstart.addTo(map);
    }

    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
      alert(e.message);
    }

    map.on('locationerror', onLocationError);
    L.Routing.control({
      waypoints: [
        // my location 46.7541196,23.5585341
        L.latLng(this.city.lat, this.city.lon),
        L.latLng([this.restaurant.lat, this.restaurant.lon], {icon: greenIcon})
        //  L.latLng(hotelmarker.lat, hotelmarker.lng)
      ]
    }).addTo(map);

    restaurantmarker = L.marker([this.restaurant.lat, this.restaurant.lon]
      //,{icon: greenIcon, iconSize: [map.getZoomScale(2)]}
    )
      .addTo(map).bindPopup(this.restaurant.name).openPopup();
  }

  scroll(el: HTMLElement) {

    // el.scrollIntoView();
    el.scrollIntoView({behavior: "smooth"});
  }

  toggle() {
    this.show = !this.show;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.show)
      this.commentsubmitted = "Hide";
    else
      this.commentsubmitted = "Add comment";
  }

  toggleReservation() {
  this.showReservation = !this.showReservation;

  // CHANGE THE NAME OF THE BUTTON.
  if (this.showReservation)
    this.showHideReservationButton = "Hide";
  else
    this.showHideReservationButton = "Add new reservation";
}
  toggleTypeOfFood() {
    this.showTypeOfFood = !this.showTypeOfFood;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.showTypeOfFood)
      this.showHideTypeOfFoodButton = "Hide";
    else
      this.showHideTypeOfFoodButton = "Add new type of food";
  }


  addRestaurant(){
    this.router.navigate(['restaurant/insert/'+this.city.id]);
  }
  editRestaurant(){
    this.router.navigate(['restaurant/edit/', this.id]);
  }

  removeRestaurant(restaurantID:number){
    if(confirm('Are you sure you want to delete the '+ this.restaurant.name+" restaurant?")) {
      console.log("restaurant with id : " + restaurantID + " removed")
      this.restaurantService.deleteRestaurant(restaurantID).subscribe(data =>
        this.router.navigate(['city/', this.city.id]));
    }
  }


  onAddReservation(){
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];//restaurantid
      this.reservationAdd.user_id=this.userid;
      this.reservationAdd.roomBooked=false;
      this.reservationAdd.tableBooked=true;
      this.reservationAdd.restaurant_id=this.id;
      this.reservationService.insertReservation(this.reservationAdd)
        .subscribe(data => {
          this.router.navigate(['restaurant/'+this.id]);
          location.reload( );
        });
    });
  }

  filterByDate(startDate:Date){
    this.userRestaurantReservationsByDate=[];
    console.log(startDate);
    for(let i=0;i<this.restaurantReservations.length;i++){
      if(this.restaurantReservations[i].reservation_start==startDate){
        this.userRestaurantReservationsByDate.push(this.restaurantReservations[i]);
        console.log("ceva tabel size"+this.userRestaurantReservationsByDate.length);
        this.nrTablesAvailable =this.restaurant.tables-this.userRestaurantReservationsByDate.length;
      }
    }

  }

  editReservation(reservationid:number){
    this.router.navigate(['reservation/edit/', reservationid]);
  }
  removeReservation(reservationid:number){
    if(confirm('Are you sure you want to delete the reservation?')) {
      console.log("Reservation removed");
      this.reservationService.deleteReservation(reservationid).subscribe(data =>
        this.router.navigate(["restaurant/", this.id]))
    }
  }

  onAddTypeOfFood(){
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];//restaurantid
      this.typeOfFoodAdd.restaurant_id=this.id;
      this.typeOfFoodService.insertTypeOfFood(this.typeOfFoodAdd)
        .subscribe(data => {
          this.router.navigate(['restaurant/'+this.id]);
          location.reload( );
        });
    });
  }
  removeTypeOfFood(typeOfFoodId:number, typeOfFoodName:string){
    if(confirm('Are you sure you want to delete ' +typeOfFoodName+
        '  type of food?')) {
      console.log("type of food with id : " + typeOfFoodId + " removed")
      this.typeOfFoodService.deleteTypeOfFood(typeOfFoodId).subscribe(data =>{
          this.router.navigate(['restaurant/', this.id]);
          location.reload();
      }
        );
    }
  }
}
