import {Component, OnInit} from "@angular/core";


import {Router} from "@angular/router";

import {User} from "../../model/user";
import {UserService} from "../../services/user.service";
import {TokenStorageService} from "../../services/token-storage.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  displayedColumns: string[] = ['name','username', 'telephone', 'details','remove','edit'];
  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  id: number;

  constructor(private router: Router, private userService: UserService, private tokenStorageService: TokenStorageService) {
  }

  ngOnInit() {
    // daca userul nu este logat
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.id = user.id;

    } else { this.router.navigate(['login']); }
    this.userService.getUsers()
      .subscribe(data => {
        this.users = data;
      });
    //this.users = this.users.sort((a: any, b: any) => a.name - b.name);
    //this.users = this.users.sor
  }

  viewDetails(id: number): void {
    this.router.navigate(['user/', id]);
  }
  login() {
    this.router.navigate(['login']);
  }
  editUserDetails(id:number){
    this.router.navigate(['edit/',id]);
  }
  removeUser(userID:number){
    if(confirm('Are you sure you want to delete the user with id: '+ userID+" ?")) {
      console.log("TouristAttraction with id: " + userID + " removed")
      this.userService.deleteUser(userID).subscribe(data => this.router.navigate(['users/']));
    }
  }

}
