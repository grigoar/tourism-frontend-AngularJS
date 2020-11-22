import {Component, OnInit} from '@angular/core';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from "../../services/event.service";
import {Image} from "../../model/image";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EditEventComponent implements OnInit  {

  event: Event = new Event();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

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

  eventImages: Image[] = [];

  eventid:number;
  sub:any;
  constructor(private router: Router, private eventService: EventService,private route: ActivatedRoute, private httpClient: HttpClient, private userService: UserService) { }
  ngOnInit() {

    /*//trebuie modificat sa faca edit la orasul care trebuie=> pus butonul de edit unde trebuie
    this.cityService.getCityById(1) .subscribe(data => {
      this.city = data;
    });*/

    this.sub = this.route.params.subscribe(params => {
      this.eventid = +params['id'];
      this.eventService.getAllEventImagesById(this.eventid)
        .subscribe(data => {
          this.eventImages = data;
        });
    });
    this.sub = this.route.params.subscribe(params => {
      this.eventid = +params['id'];
      this.eventService.getEventById(this.eventid)
        .subscribe(data => {
          this.event = data;
        });
    });
  }

  editEvent() {
    this.eventService.editEvent(this.event)
      .subscribe(data => this.router.navigate(['event/',this.eventid]));
  }

  /*insertUser(): void {

    this.userService.insertUser(this.user)
      .subscribe(data => this.router.navigate(['users']));
    /!* .subscribe( data => {
     alert('User created successfully.');
     });
     *!/
  }*/
  /*ngOnInit() {
   this.sub = this.route.params.subscribe(params => {
   // this.id = +params['id'];
   this.userService.insertUser()
   .subscribe(data => {
   this.user = data;
   });
   });
   }*/

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

      this.httpClient.post('http://localhost:8080/event/upload/' + this.eventid, uploadData)
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

  deleteEventImageById(imageID:number){
    console.log("To delete image with id: "+imageID);
    //this.router.navigate(['remove', id]);
    this.userService.deleteImageById(imageID)
      .subscribe(data =>
      { this.router.navigate(['event/edit/', this.eventid]);
        location.reload()});
    //this.router.navigate(['cities/edit/', this.city.id]);
    /* .subscribe(data => {
     this.users = this.users.filter(u => u !== user);
     });*/
  }
}
