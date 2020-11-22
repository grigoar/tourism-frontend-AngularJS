import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from "../../model/user";
import {AuthService} from "../../services/auth.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
   styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit  {

  user: User = new User();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService,private router: Router,private toastr: ToastrService) { }
  ngOnInit() {


  }

  onSubmit() {
   /* var error = document.getElementById("error");
    if (isNaN(document.getElementById("number").value)){
      // Changing content and color of content
      error.textContent = "Please enter a valid number"
      error.style.color = "red"
    } else {
      error.textContent = ""
    }*/

      this.authService.register(this.user).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.toastr.success('Welcome '+this.user.username+'. Your data was succesful registred! Login and continue to enjoy using our servces!');
        this.router.navigate(['login']);
      },
      err => {
        this.errorMessage = err.error.message;
        //this.toastr.error(err.error_description);
        this.toastr.error(err.error.message);
        this.isSignUpFailed = true;
       // console.log("Implement delete functionality here");

      }
    );

  }
  validateForm() {
  let x = document.forms["form-group"]["name"].value;
  if (x == "") {
    alert("Name must be filled out");
    return false;
  }
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

}
