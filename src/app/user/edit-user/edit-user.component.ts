import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../model/user";
import {TokenStorageService} from "../../services/token-storage.service";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {Image} from "../../model/image";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  user: User;
  id: number;
  private sub: any;

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  editForm: FormGroup;

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

  userImage: Image = null;

  userid:number;


  constructor(private tokenStorageService: TokenStorageService, private router: Router,
              private route: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder,
              private authService: AuthService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    /*this.isLoggedIn = !!this.tokenStorageService.getToken();

     this.editForm = this.formBuilder.group({
     id: [''],
     username: ['', Validators.required],
     password: ['', Validators.required],
     name: ['', Validators.required],
     email: ['', Validators.required],
     country: ['', Validators.required]
     });
     if (this.isLoggedIn) {
     const user = this.tokenStorageService.getUser();
     this.roles = user.roles;

     this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
     this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

     this.username = user.username;
     this.id = user.id;

     }
     this.userService.getUserById(this.id).subscribe(data => {
     this.editForm.setValue(data);
     });*/
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.id = user.id;

    }

    // this.userService.getUserById(this.id).subscribe(data => {
    //   this.user = data;
    // });

    this.sub = this.route.params.subscribe(params => {
      this.userid = +params['id'];
      this.userService.getUserById(this.userid)
        .subscribe(data => {
          this.user = data;
        });
    });
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.userService.getUserImageById(this.id)
        .subscribe(data => {
          this.userImage = data;
        });
    });
  }

  editUser(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.authService.editUser(this.user)
        .subscribe(data => this.router.navigate(['user/' + this.id]));
      /* .subscribe(data => {
       this.user = data;
       });*/
    });
  }


  public onFileChanged(event) {
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
      //pt size
      /* if(size > 1000000)
      {
        alert("size must not exceeds 1 MB");
        this.form.get('profileImage').setValue("");
      }*/
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

      this.httpClient.post('http://localhost:8080/user/upload/' + this.id, uploadData)
        .subscribe(
          res => {
            console.log(res);
            this.receivedImageData = res;
            this.base64Data = this.receivedImageData.pic;
            this.convertedImage = 'data:image/jpeg;base64,' + this.base64Data;
            this.router.navigate(['user/' + this.id]);
          },
          err => console.log('Error Occured duringng saving: ' + err)
        );

    }
  }

}



