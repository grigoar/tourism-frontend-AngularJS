import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from "./auth.service";
import {TokenStorageService} from "./token-storage.service";
import {ToastrService} from "ngx-toastr";
//import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService,
              private tokenService: TokenStorageService,
              private toastr: ToastrService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {


    //
    // if (this.authService.isUserLoggedIn())
    //   return true;
    //
    // this.router.navigate(['login']);
    // return false;

    const currentUser = this.tokenService.getUser();
    // if (this.authService.isUserLoggedIn()) {
    // return true;
    // }
    //console.log("the current user id from local storage "+currentUser.id)

    //console.log("ceva verificare roluri din canActivate" + route.data.roles)
    // for (let i = 0; i < route.data.roles.length; i++) {
    //   console.log("rolul " + i + " is: " + route.data.roles[i]);
    // }
    if (currentUser) {
      console.log("rouluri user: " + currentUser.roles)
      // check if route is restricted by role
      //if (route.data.roles && route.data.roles.indexOf(currentUser.roles) === -1) {
     for(let i = 0; i < currentUser.roles.length; i++)
      if (route.data.roles.includes(currentUser.roles[i])) {
        // role not authorised so redirect to home page
        console.log("ceva verificare roluri din if")
        // this.router.navigate(['/']);
        return true;
      }
      //NOT authorised so return true
      this.router.navigate(['login']);
      this.toastr.error('You are not authorised to use this resources! Try with a different account');
      return false;

    }
    else{
      // this.router.navigate(['login']);
      // this.toastr.error('You are not authorised to use this resources! Log in first');
      // return false;
    }
    this.router.navigate(['login']);
    this.toastr.error('You are not authorised to use this resources! Log in into your account');

    return false;
  }

  // const user = this.tokenStorageService.getUser();
  // this.rolesuser = user.roles;
  //
  // this.showModeratorBoard = this.rolesuser.includes('ROLE_MODERATOR');
  //
  // this.username = user.username;
  // this.userid = user.id;

  //varianta modificata
//   const currentUser = this.tokenService.getUser();
//   // if (this.authService.isUserLoggedIn()) {
//   // return true;
//   // }
//   console.log("ceva verificare roluri din canActivate")
//   if (currentUser) {
//     console.log("rouluri user: "+currentUser.roles)
//     // check if route is restricted by role
//     this.response=route.data.roles.includes(currentUser.roles);
//     console.log("verificare if"+this.response)
//     console.log("verificare user roles to string"+currentUser.roles)
//     if (route.data.roles.includes(currentUser.roles)) {
//       console.log("rouluri acceptate: "+route.data.roles)
//       // role not authorised so redirect to home page
//       console.log("ceva verificare roluri din if")
//       //this.router.navigate(['/']);
//       return true;
//     }
//     // authorised so return true
//     this.router.navigate(['/']);
//     return false;
//   }
//
//   this.router.navigate(['login']);
//   return false;
// }
}
