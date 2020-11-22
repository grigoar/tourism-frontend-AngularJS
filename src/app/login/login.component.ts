import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {TokenStorageService} from '../services/token-storage.service';
import {AuthService} from '../services/auth.service';
import {ToastrService} from "ngx-toastr";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  //destinationUrl = '/map-home';

  isPassword = true;

  constructor(private router: Router, private authService: AuthService, private tokenStorage: TokenStorageService, private toastr:ToastrService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }



  }

  onSubmit() {
    this.authService.login(this.form).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
         //this.reloadPage();

        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
        // this.router.navigate(['/map-home']);
        this.toastr.success('Welcome '+this.form.username+'! Enjoy using our services!');

        //window.location.href = '/map-home';
        //window.location.reload();
        //location.reload();
       // this.reloadPage();
       // window.reload();
      },
      err => {
        //this.errorMessage = err.error.message;
       /* this.toastr.error('Username or password incorrect! Try again', 'Major error',{
         // tapToDismiss:true,
         // positionClass:'toast-top-middle'
        });*/
        this.errorMessage='Username or password incorrect! Try again';
        this.toastr.error('Username or password incorrect! Try again');
       // this.toastr.error(err.error.message);
        this.isLoginFailed = true;
      }
    );

  }

  showPassword() {

    this.isPassword = false;

  }

  hidePassword() {

    this.isPassword = true;

  }

  reloadPage() {
   // window.location.reload();
  }
}
