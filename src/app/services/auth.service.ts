import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {TokenStorageService} from "./token-storage.service";
import {User} from "../model/user";

const AUTH_API = 'http://localhost:8080/user/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //pentru verificarea daca utilizatorul este logat
  private rolesuser: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  userid: number;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private tokenStorageService: TokenStorageService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(window.localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user /*{
      username: user.username,
      email: user.email,
      password: user.password
    }*/, httpOptions);
  }
  editUser( user): Observable<any> {
    return this.http.put(AUTH_API + 'update/' , user, httpOptions);
  }
  isUserLoggedIn(){
    let user = localStorage.getItem('username')
    console.log(!(user === null))
    return !(user === null)
  }
  isModerator(){

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.rolesuser = user.roles;

      this.showModeratorBoard = this.rolesuser.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.userid = user.id;

    }
    return this.showModeratorBoard;
  }

  isAdmin(){
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.rolesuser = user.roles;

      this.showAdminBoard = this.rolesuser.includes('ROLE_ADMIN');

      this.username = user.username;
      this.userid = user.id;

    }
    return this.showAdminBoard;
  }
}
