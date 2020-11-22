import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Comment} from '../../model/comment';
import {log} from 'util';
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {Hotel} from "../../model/hotel";
import {User} from "../../model/user";
import {HotelService} from "../../services/hotel.service";
import {CommentService} from "../../services/comment.service";
import {UserService} from "../../services/user.service";
import {TokenStorageService} from "../../services/token-storage.service";

import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
import {CityService} from "../../services/cities.service";
import {City} from "../../model/city";
import Chart from 'chart.js';
import {Image} from "../../model/image";
import {HttpClient} from "@angular/common/http";
import {ReservationService} from "../../services/reservation.service";
import {Reservation} from "../../model/reservation";



declare let L;
@Component({
  selector: 'app-hotel-page',
  templateUrl: './hotel-page.component.html',
  styleUrls: ['./hotel-page.component.css']
})
export class HotelPageComponent implements OnInit {

  comments: Comment[] = [];
  commentsWithImage:Comment[] = [];

  displayedColumnsComments: string[] = ['Details', 'Date', 'Username'];
  currentRate = 3.14;
  hotel: Hotel = null;
  city: City;
  id: number;
  private sub: any;
  usercomment: User;
  users: User[] = [];
  //displayedColumns: string[] = ['name', 'telephone', 'details'];

  show = false;
  showmap = false;
  showmapbutton: any = 'See map directions';
  commentsubmitted: any = 'Add new comment';
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

  userImage: Image = null;
  usersImage:Image[]=[];

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
  hotelImages:Image[]=[];

  datesLabel=[];

  markerstart: any;

  currentLongitude:number=null;
  currentLatitude:number=null;

  //pentru reservari si butoatne si filtre
  hotelReservations:Reservation[]=[];
  userReservation:User=null;

  userHotelReservations:Reservation[]=[];

  startDate:Date;
  endDate:Date;
  reservationAdd=new Reservation();
  userHotelReservationsByDate:Reservation[]=[];

  showReservation=false;
  showHideReservationButton="Add new reservation";
  cevaData:any;

  constructor(private route: ActivatedRoute, private hotelService: HotelService, private cityService: CityService,
              private commentService: CommentService,
              private userService: UserService, private router: Router, config: NgbRatingConfig,
              private tokenStorageService: TokenStorageService, private httpClient: HttpClient, private reservationService: ReservationService) {
    // customize default values of ratings used by this component tree
    config.max = 5;
    config.readonly = true;
  }

// Grand hotel italia 46.75584,23.6281856
  // HOtel Belagio 46.7676187,23.5367241
  ngOnInit() {

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.userid = user.id;

    }

    this.userService.getUsers()
      .subscribe(data => {
        this.users = data;
      });

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.hotelService.getHotelById(this.id)
        .subscribe(data => {
          this.hotel = data;
          console.log(this.hotel.lat + ' ' + this.hotel.lon);
          this.cityService.getCityById(this.hotel.city_id)
            .subscribe(data1 => {
              this.city = data1;
              this.onMap();
            });

          // this.marker = L.marker([this.hotel.lat, this.hotel.lon]).addTo(map);
        });
    });
    // this.userService.getUserById(this.comments.user_id);
    // log('ceva' + this.userService.getUserById(this.comment.user_id));
    // cautare comments pentru hotelul selectat dupa id
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.commentService.getCommentsFromHotel(this.id)
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
      this.commentService.getCommentsRatingForHotel(this.id)
        .subscribe(data => {
          // this.userService.getUserById(this.comments.user_id);
          this.dataForRatingChart = data;
          console.log(this.dataForRatingChart);
          //this.constructChart();
          // this.constructHotelChart();
          this.constructChart();

        });
    });

    //get all hotel images
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.hotelService.getAllHotelImagesById(this.id)
        .subscribe(dataImages => {
          this.hotelImages = dataImages;
          console.log("functioneaza backendul "+this.hotelImages[1].pic);
        });
    });

    //get all hotel reservations
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.reservationService.getAllReservationsFromHotelById(this.id)
        .subscribe(data => {
          this.hotelReservations = data;
          for(let i=0;i<this.hotelReservations.length;i++){
            this.userHotelReservationsByDate[i]=this.hotelReservations[i];
            this.userReservation=this.hotelReservations[i].user;
            console.log("functioneaza backendul si rezrvarile cu userul cu emailul: "+this.userReservation.email);
          }

          console.log("functioneaza backendul si rezrvarile cu userul cu emailul: "+this.userReservation.email);
        });
    });

    //get all user reservations
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.reservationService.getUserReservationsHotel(this.userid,this.id)
        .subscribe(data => {
          this.userHotelReservations = data;
          });
        });
  }

  viewUserName(id: number): void {
    this.userService.getUserById(id)
      .subscribe(data => {
        this.usercomment = data;
      });
  }


  onSubmit(rating) {
    this.commentadd.rating = rating;
    this.commentadd.hotel_id = this.id;
    this.commentadd.user_id = this.userid;
    this.commentService.insertComment(this.commentadd)
      .subscribe(data => this.router.navigate(['hotel/', this.commentadd.hotel_id]).then(() => {
        window.location.reload();
      }));
    this.commentsubmitted = false;
  }

  setValue(val: number) {
    this.commentadd.rating = val;
  }


  addComment(id): void {
    this.router.navigate(['/comment/add/', id]);
  }

  scroll(el: HTMLElement) {

    // el.scrollIntoView();
    el.scrollIntoView({behavior: "smooth"});
  }

  /*  hideComment(){
   this.commentsubmitted = !this.commentsubmitted;
   }*/

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

  onMap() {

    //  const map = L.map('map').setView([this.hotel.lat, this.hotel.lon], 5);
    //  const markerParis = L.marker([48.8566, 2.3522]).addTo(map);
    let hotelmarker;

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
        iconUrl: 'assets/leaflet/images/hotel-pin.png',
        iconSize: [map.getZoom / 2, map.getZoom / 2],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        radius: 200
      });
      //hotelmarker.setIcon(greenIcon);
    });



    console.log(this.hotel.lat + ' ' + this.hotel.lon);
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
      }).addTo(map).bindPopup("Your location").openPopup();
      //console.log("Latitude and longitude of the hotel : "+this.hotel.lat + ' ' + this.hotel.lon);
     /* let latLngss=[
       [46.7541196,23.5585341],
       [46.7541196,23.6585341]
       ];
       let polyline=L.polyline(latLngss,{color:'red'}).addTo(map).bindPopup("current location");*/

      //  this.markerstart = L.marker(e.latlng).bindPopup("Your location");
      //   this.markerstart.addTo(map);
      console.log("latitude + longitude current location :"+e.latlng+ " or just longitude : "+ e.latitude+" or just latitude :"+ e.longitude);


    if(e.latitude!=null&&e.longitude!=null){
      this.currentLatitude=e.latitude;
      this.currentLongitude=e.longitude;
    }


    }

    console.log("latitude current location :"+ this.currentLatitude+ " or just longitude : "+ this.currentLongitude);
    var marker;
    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
      alert(e.message);
    }

    map.on('locationerror', onLocationError);

    //might not working because it uses ORM demo server to show the directions
    L.Routing.control({
      waypoints: [
        // my location 46.7541196,23.5585341
        L.latLng(this.city.lat, this.city.lon),
        L.latLng([this.hotel.lat, this.hotel.lon])
        //  L.latLng(hotelmarker.lat, hotelmarker.lng)
      ]
    }).addTo(map);
    hotelmarker = L.marker([this.hotel.lat, this.hotel.lon]
      //,{icon: greenIcon, iconSize: [map.getZoomScale(2)]}
    )
      .addTo(map).bindPopup(this.hotel.name).openPopup();


  }

  drawTheRoute(){

  }
  toggleMap() {
    this.showmap = !this.showmap;
    // CHANGE THE NAME OF THE BUTTON.
    if (this.showmap)
      this.showmapbutton = "Hide map";
    else
      this.showmapbutton = "See map directions";
  }



  //pentru rating statistics
  constructChart(){
    /*let today=new Date();
    let endDate= new Date();
    this.datesLabel=*/
    console.log("ceva date pentru chart"+this.dataForRatingChart);

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
          text: 'Average rating in the last 12 months based on customers feedback',
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

      this.httpClient.post('http://localhost:8080/hotel/upload/' + this.id, uploadData)
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
  addHotel(){
    this.router.navigate(['hotels/add/'+this.city.id]);
  }
  editHotel(){
    this.router.navigate(['hotels/edit/', this.hotel.id]);
  }

  removeHotel(hotelID:number){
    if(confirm('Are you sure you want to delete the '+ this.hotel.name+" hotel?")) {
      console.log("Hotel" + hotelID + " removed")
      this.hotelService.deleteHotel(hotelID).subscribe(data =>
        this.router.navigate(["city/", this.city.id]))
    }
  }

  onAddReservation(){
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];//hotelid
      this.reservationAdd.user_id=this.userid;
      this.reservationAdd.roomBooked=true;
      this.reservationAdd.tableBooked=false;
      this.reservationAdd.hotel_id=this.id;
      this.reservationAdd.restaurant_id=0;
      this.reservationService.insertReservation(this.reservationAdd)
        .subscribe(data => {
          this.router.navigate(['hotel/'+this.id]);
          this.cevaData=data;
           location.reload( );
        });
    });
  }

  filterByDate(startDate:Date, endDate:Date){
    this.userHotelReservationsByDate=[];
    console.log(startDate,endDate);
    if(endDate==null){
      endDate=startDate;
    }
    for(let i=0;i<this.hotelReservations.length;i++){
      if((this.hotelReservations[i].reservation_start>=startDate&&this.hotelReservations[i].reservation_end<=endDate)||(this.hotelReservations[i].reservation_start<=startDate&&this.hotelReservations[i].reservation_end<=endDate&&this.hotelReservations[i].reservation_end>=startDate)||(this.hotelReservations[i].reservation_start<=startDate&&this.hotelReservations[i].reservation_end>=endDate)||(this.hotelReservations[i].reservation_start>=startDate&&this.hotelReservations[i].reservation_end>=endDate&&this.hotelReservations[i].reservation_start<=endDate)){
        this.userHotelReservationsByDate.push(this.hotelReservations[i]);
        console.log("ceva tabel size"+this.userHotelReservationsByDate.length);
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
        this.router.navigate(["hotel/", this.id]))
      location.reload( );
    }
  }
}
