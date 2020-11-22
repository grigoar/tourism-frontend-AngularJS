import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../model/user';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenStorageService} from "../../services/token-storage.service";
import {Image} from "../../model/image";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user: User = null;
  id: number;
  private sub: any;
  roles: string[] = [];
  userrole: string;

  private rolesuser: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  userid: number;

  userImage:Image;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const userr = this.tokenStorageService.getUser();
      this.rolesuser = userr.roles;

      this.showAdminBoard = this.rolesuser.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.rolesuser.includes('ROLE_MODERATOR');

      this.username = userr.username;
      this.userid = userr.id;

    }

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.userService.getUserById(this.id)
        .subscribe(data => {
          this.user = data;
          //this.roles = this.user.roles.toString();
          /*this.roles.push("user");
           this.roles.push("mod");
           this.roles.push("admin");
           console.log("role 1: "+this.roles[0]+" role 2: "+this.roles[1]+" role 3: "+ this.roles[2]);*/
          if (this.user.roles[0] != null && this.user.roles[1] != null && this.user.roles[2] != null) {
            this.roles.push("user");
            this.roles.push("mod");
            this.roles.push("admin");
            this.user.roles = this.roles;
          } else if (this.user.roles[0] != null && this.user.roles[1] != null) {
            this.roles.push("user");
            this.roles.push("mod");
            this.user.roles = this.roles;
          } else {
            this.roles.push("user");
            this.user.roles = this.roles;
          }
          console.log("role 1: " + this.roles[0] + " role 2: " + this.roles[1] + " role 3: " + this.roles[2]);
          // console.log("role 1: "+this.roles[0]);
          console.log("roluri " + JSON.stringify(this.user));


          // console.log("roluri "+this.roles[0]);

        });
    });


    // this.userrole = this.roles[0];

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.userService.getUserImageById(this.id)
        .subscribe(data => {
          this.userImage = data;
        });
    });
  }

  editUserDetails(id): void {
    this.router.navigate(['/edit/', id]);
  }

  addModeratorRole() {
   /* if (this.roles[0] != null && this.user.roles[1] != null && this.user.roles[2] != null) {
      this.roles.push("user");
      this.roles.push("mod");
      this.roles.push("admin");
    } else if (this.user.roles[0] != null && this.user.roles[1] != null) {
     // this.roles.push("user");
      this.roles.push("mod");
    } else {
     // this.roles.push("user");
      this.roles.push("mod");
    }
    this.user.roles = this.roles;
    this.user.role = this.roles;
    this.userService.makeUserModerator(this.user)
      .subscribe(data => {
        this.user = data;
        //this.router.navigate(['user/' + this.user.id])
      });*/
    let newRoles:string[]=[];
    newRoles.push("user");
    newRoles.push("mod");
    this.user.role = newRoles;
    this.userService.makeUserModerator(this.user)
      .subscribe(data => {
        this.user = data;
        location.reload();
       // window.location.reload();
        //this.router.navigate(['user/' + this.id])
      });
  }

  removeModeratorRole(){
    let newRoles:string[]=[];
    newRoles.push("user");
    this.user.role = newRoles;
    this.userService.makeUserModerator(this.user)
      .subscribe(data => {
        this.user = data;
       // this.router.navigate(['user/' + this.user.id])
        location.reload();
      });

  }

}
