import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {City} from "../../model/city";
import {CityService} from "../../services/cities.service";
import {HttpClient} from "@angular/common/http";
import {Image} from "../../model/image";
import {UserService} from "../../services/user.service";


@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class EditCityComponent implements OnInit  {

  city: City = new City();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  cityid:number;
  private sub: any;

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

  cityImages: Image[] = [];

  constructor(private router: Router, private cityService: CityService, private route: ActivatedRoute, private httpClient: HttpClient, private userService: UserService) { }
  ngOnInit() {
    //trebuie modificat sa faca edit la orasul care trebuie=> pus butonul de edit unde trebuie
   /* this.cityService.getCityById(1) .subscribe(data => {
      this.city = data;
    });
    this.userService.getUserById(this.id).subscribe(data => {
      this.user = data;
    });*/

    this.sub = this.route.params.subscribe(params => {
      this.cityid = +params['id'];
      this.cityService.getAllCityImagesById(this.cityid)
        .subscribe(data => {
          this.cityImages = data;
        });
    });
    this.sub = this.route.params.subscribe(params => {
      this.cityid = +params['id'];
      this.cityService.getCityById(this.cityid)
        .subscribe(data => {
          this.city = data;
        });
    });
  }

 /* editUser(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.authService.editUser(this.user)
        .subscribe(data => this.router.navigate(['user/' + this.id]));
      /!* .subscribe(data => {
       this.user = data;
       });*!/
    });
  }*/

  editCity() {
    this.cityService.editCity(this.city)
      .subscribe(data => this.router.navigate(['cities']));
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

      this.httpClient.post('http://localhost:8080/city/upload/' + this.cityid, uploadData)
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

  deleteCityImageById(imageID:number){
    console.log("To delete image with id: "+imageID);
    //this.router.navigate(['remove', id]);
    this.userService.deleteImageById(imageID)
      .subscribe(data =>
      { this.router.navigate(['cities/edit/', this.city.id]);
        location.reload()});
    //this.router.navigate(['cities/edit/', this.city.id]);
    /* .subscribe(data => {
     this.users = this.users.filter(u => u !== user);
     });*/
  }
}
