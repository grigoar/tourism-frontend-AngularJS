import {Component, OnInit} from '@angular/core';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {Hotel} from "../../model/hotel";
import {HotelService} from "../../services/hotel.service";
import {Image} from "../../model/image";
import {UserService} from "../../services/user.service";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-hotel-edit',
  templateUrl: './hotel-edit.component.html',
  styleUrls: ['./hotel-edit.component.css']
})
export class EditHotelComponent implements OnInit  {

  hotel: Hotel = new Hotel();
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

  hotelImages: Image[] = [];

  hotelid:number;
  sub:any;
  constructor(private router: Router, private hotelService: HotelService, private route: ActivatedRoute, private httpClient: HttpClient, private userService: UserService) { }
  ngOnInit() {
    /*//trebuie modificat sa faca edit la orasul care trebuie=> pus butonul de edit unde trebuie
     this.cityService.getCityById(1) .subscribe(data => {
     this.city = data;
     });*/

    this.sub = this.route.params.subscribe(params => {
      this.hotelid = +params['id'];
      this.hotelService.getAllHotelImagesById(this.hotelid)
        .subscribe(data => {
          this.hotelImages = data;
        });
    });
    this.sub = this.route.params.subscribe(params => {
      this.hotelid = +params['id'];
      this.hotelService.getHotelById(this.hotelid)
        .subscribe(data => {
          this.hotel = data;
        });
    });
  }

  editHotel() {
    this.hotelService.editHotel(this.hotel)
      .subscribe(data => this.router.navigate(['hotel/'+this.hotel.id]));
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

      this.httpClient.post('http://localhost:8080/hotel/upload/' + this.hotel.id, uploadData)
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

  deleteHotelImageById(imageID:number){
    console.log("To delete image with id: "+imageID);
    //this.router.navigate(['remove', id]);
    this.userService.deleteImageById(imageID)
      .subscribe(data =>
      { this.router.navigate(['hotels/edit/', this.hotel.id]);
        location.reload()});
    //this.router.navigate(['cities/edit/', this.city.id]);
    /* .subscribe(data => {
     this.users = this.users.filter(u => u !== user);
     });*/
  }
}
