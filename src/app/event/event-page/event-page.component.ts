import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Event} from '../../model/event';
import {Comment} from '../../model/comment';
import {log} from 'util';
import {NgbRatingConfig} from '@ng-bootstrap/ng-bootstrap';
import {User} from "../../model/user";
import {EventService} from "../../services/event.service";
import {CommentService} from "../../services/comment.service";
import {UserService} from "../../services/user.service";
import {TokenStorageService} from "../../services/token-storage.service";
import {HttpClient} from "@angular/common/http";
import {Image} from "../../model/image";
import {UsersEvents} from "../../model/usersEvents";
import {CityService} from "../../services/cities.service";
import {City} from "../../model/city";
import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';

declare let L;

@Component({
  selector: 'app-event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {

  comments: Comment[] = [];
  displayedColumnsComments: string[] = ['Details', 'Date', 'Username'];

  event: Event = null;
  id: number;
  submitted;

  radioValue: number;
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
  eventImages:Image[]=[];

  usersEvents:UsersEvents=new UsersEvents();

  userImage:Image=null;
  city:City=null;
  show = false;
  commentsubmitted: any = 'Add comment';
  constructor(private route: ActivatedRoute, private eventService: EventService, private commentService: CommentService,
  private userService: UserService, private router: Router, config: NgbRatingConfig,
  private tokenStorageService: TokenStorageService,private cityService: CityService, private httpClient: HttpClient) {
    // customize default values of ratings used by this component tree
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe(data => {
        this.users = data;
      });
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.eventService.getEventById(this.id)
        .subscribe(data => {
          this.event = data;
          this.cityService.getCityById(this.event.city_id)
            .subscribe(data1 => {
              this.city = data1;
              this.onMap();
            });
        });
    });
   // this.userService.getUserById(this.comments.user_id);
    // log('ceva' + this.userService.getUserById(this.comment.user_id));
   // cautare comments pentru hotelul selectat dupa id
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.commentService.getCommentsFromEvent(this.id)
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

    this.submitted = sessionStorage.getItem('submitted');


    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.userid = user.id;

    }


    //get all event images
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.eventService.getAllEventImagesById(this.id)
        .subscribe(dataImages => {
          this.eventImages = dataImages;
          console.log("functioneaza backendul "+this.eventImages[1].pic);
        });
    });

  }
  viewUserName(id: number): void {
    this.userService.getUserById(id)
      .subscribe(data => {
        this.usercomment = data;
      });
  }

  addComment(id): void {
    this.router.navigate(['/comment/add/', id]);
  }
  submitAnswer(going: number) {
   // this.submitted = !this.submitted;
    sessionStorage.setItem("submitted", "true");

  //  document.getElementById('result').innerHTML = sessionStorage.getItem('submitted');
    if (going == 1) {
      this.event.going = this.event.going + 1;
    } else if (going == 2) {
      this.event.maybe = this.event.maybe + 1;
    }
    this.eventService.editEventGM(this.event).subscribe(data => {
      this.event = data;
      window.location.reload();
    });

    console.log('submitting');
    console.log(going);

   // window.location.reload();
  }
  playAudio() {
    const audio = new Audio();
    audio.src = '../../../assets/audio/monkey.mp3';
    audio.load();
    audio.play();
  }
 // this.playAudio();
  changeSub() {
    sessionStorage.removeItem('submitted');
    window.location.reload();
  }

  // add new comments functions
  onSubmit(rating) {
    this.commentadd.rating = rating;
    this.commentadd.event_id = this.id;
    this.commentadd.user_id = this.userid;
    this.commentService.insertComment(this.commentadd)
      .subscribe(data => this.router.navigate(['event/', this.commentadd.event_id]).then(() => {
        window.location.reload();
      } ));
  }
  setValue(val: number) {
    this.commentadd.rating = val;
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

      this.httpClient.post('http://localhost:8080/event/upload/' + this.id, uploadData)
        .subscribe(
          res => {
            console.log(res);
            this.receivedImageData = res;
            this.base64Data = this.receivedImageData.pic;
            this.convertedImage = 'data:image/jpeg;base64,' + this.base64Data;
          },
          err => console.log('Error Occured duringng saving: ' + err)
        );

    }
  }


  submitAnswerUsersEvent(going: number) {

    if (going == 1) {
      this.usersEvents.goMaybe = 1;
    } else if (going == 2) {
      this.usersEvents.goMaybe = 2;
    } else if(going == 0){
      this.usersEvents.goMaybe = 0;
    }else {
      this.usersEvents.goMaybe = 0;
    }
    this.usersEvents.user_id=this.userid;
    this.usersEvents.event_id=this.event.id;
    this.eventService.addUsersEvents(this.usersEvents).subscribe(data => {
      this.usersEvents = data;
      this.submitted = !this.submitted;
      location.reload();
      sessionStorage.setItem("submitted", "false");
      document.getElementById('result').innerHTML = sessionStorage.getItem('submitted');

    });

    console.log('submitting');
    console.log(going);
    //location.reload();
     //window.location.reload();
  }

  onMap() {

    //  const map = L.map('map').setView([this.hotel.lat, this.hotel.lon], 5);
    //  const markerParis = L.marker([48.8566, 2.3522]).addTo(map);
    let eventmarker;

    const map = L.map('map');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let greenIcon = L.icon({
      iconUrl: 'assets/leaflet/images/event-pin.png',
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
        iconUrl: 'assets/leaflet/images/event-pin.png',
        iconSize: [map.getZoom / 2, map.getZoom / 2],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        radius: 200
      });
      //eventmarker.setIcon(greenIcon);
    });



    console.log(this.event.lat + ' ' + this.event.lon);
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
        L.latLng([this.event.lat, this.event.lon])
        //  L.latLng(hotelmarker.lat, hotelmarker.lng)
      ]
    }).addTo(map);

    eventmarker = L.marker([this.event.lat, this.event.lon]
      //,{icon: greenIcon, iconSize: [map.getZoomScale(2)]}
    )
      .addTo(map).bindPopup(this.event.name).openPopup();
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
  addEvent(){
    this.router.navigate(['event/insert/'+this.city.id]);
  }
  editEvent(){
    this.router.navigate(['event/edit/', this.event.id]);
  }

  removeEvent(eventID:number){
    if(confirm('Are you sure you want to delete the '+ this.event.name+" event?")){
      console.log("Event "+eventID+" removed")
      this.eventService.deleteEvent(eventID).subscribe(data=>
        this.router.navigate(['city/',this.city.id]));
    }

  }

// {
//   path: 'event/insert/:id',
//   component: AddEventComponent
// },
// {
//   path: 'event/edit/:id',
//     component: EditEventComponent
// },
}
