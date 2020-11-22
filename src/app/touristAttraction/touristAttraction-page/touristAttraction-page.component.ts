import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Comment} from '../../model/comment';
import {log} from 'util';
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {TouristAttraction} from "../../model/touristAttraction";
import {User} from "../../model/user";
import {TouristAttractionService} from "../../services/touristAttraction.service";
import {CommentService} from "../../services/comment.service";
import {UserService} from "../../services/user.service";
import {TokenStorageService} from "../../services/token-storage.service";
import Chart from 'chart.js';
import {Image} from "../../model/image";
import {HttpClient} from "@angular/common/http";
import {CityService} from "../../services/cities.service";
import {City} from "../../model/city";
import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';

declare let L;

@Component({
  selector: 'app-touristAttraction-page',
  templateUrl: './touristAttraction-page.component.html',
  styleUrls: ['./touristAttraction-page.component.css']
})
export class TouristAttractionPageComponent implements OnInit {

  comments: Comment[] = [];

  displayedColumnsComments: string[] = ['Details', 'Date', 'Username'];
  currentRate = 3.14;
  touristAttraction: TouristAttraction = null;
  id: number;
  private sub: any;
  usercomment: User;
  users: User[] = [];
  displayedColumns: string[] = ['name', 'telephone', 'details'];


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
  touristAttractionImages:Image[]=[];

  userImage:Image=null;
  city:City=null;
  show = false;
  commentsubmitted: any = 'Add comment';

  constructor(private route: ActivatedRoute, private touristAttractionService: TouristAttractionService,
              private commentService: CommentService,  private userService: UserService,
              private router: Router, config: NgbRatingConfig,
              private tokenStorageService: TokenStorageService, private cityService: CityService, private httpClient: HttpClient) {
    // customize default values of ratings used by this component tree
    config.max = 5;
    // config.readonly = true;
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
      this.touristAttractionService.getTouristAttractionById(this.id)
        .subscribe(data => {
          this.touristAttraction = data;
          this.cityService.getCityById(this.touristAttraction.city_id)
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
      this.commentService.getCommentsFromTouristAttraction(this.id)
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
      this.commentService.getCommentsRatingForTouristAttraction(this.id)
        .subscribe(data => {
          // this.userService.getUserById(this.comments.user_id);
          this.dataForRatingChart = data;
          console.log(this.dataForRatingChart);
          //this.constructChart();
          // this.constructHotelChart();
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


    //get all touristAttraction images
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.touristAttractionService.getAllTouristAttractionImagesById(this.id)
        .subscribe(dataImages => {
          this.touristAttractionImages = dataImages;
          console.log("functioneaza backendul "+this.touristAttractionImages[1].pic);
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
    this.commentadd.touristAttraction_id = this.id;
    this.commentadd.user_id = this.userid;
    this.commentService.insertComment(this.commentadd)
      .subscribe(data => this.router.navigate(['touristAttraction/', this.commentadd.touristAttraction_id]).then(() => {
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

      this.httpClient.post('http://localhost:8080/touristAttraction/upload/' + this.id, uploadData)
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
    let touristAttractionmarker;

    const map = L.map('map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let greenIcon = L.icon({
      iconUrl: 'assets/leaflet/images/touristAttraction-pin.png',
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
        iconUrl: 'assets/leaflet/images/touristAttraction-pin.png',
        iconSize: [map.getZoom / 2, map.getZoom / 2],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        radius: 200
      });
      //restaurantmarker.setIcon(greenIcon);
    });



    console.log(this.touristAttraction.lat + ' ' + this.touristAttraction.lon);
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
        L.latLng([this.touristAttraction.lat, this.touristAttraction.lon], {icon: greenIcon})
        //  L.latLng(hotelmarker.lat, hotelmarker.lng)
      ]
    }).addTo(map);

    touristAttractionmarker = L.marker([this.touristAttraction.lat, this.touristAttraction.lon]
      //,{icon: greenIcon, iconSize: [map.getZoomScale(2)]}
    )
      .addTo(map).bindPopup(this.touristAttraction.name).openPopup();
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

  //for admins and moderators panel
  addTouristAttraction(){
    this.router.navigate(['touristAttraction-page/add/'+this.id]);
  }
  editTouristAttraction(){
    this.router.navigate(['touristAttraction-page/edit/', this.touristAttraction.id]);
  }

  removeTouristAttraction(touristAttractionID:number){
    if(confirm('Are you sure you want to delete the '+ this.touristAttraction.name+" tourist attraction?")) {
      console.log("TouristAttraction with id: " + touristAttractionID + " removed")
      this.touristAttractionService.deleteTouristAttraction(touristAttractionID).subscribe(data => this.router.navigate(['city/' + this.city.id]));
    }
  }

//
// {
//   path: 'touristAttraction-page/add/:id',
//   component: AddTouristAttractionComponent
// },
// {
//   path: 'touristAttraction-page/edit',
//     component: EditTouristAttractionComponent
// },

}
