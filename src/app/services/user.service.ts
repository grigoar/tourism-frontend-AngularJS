import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../model/user';
import {stringify} from 'querystring';
import {Observable} from 'rxjs/index';
import {Image} from "../model/image";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {

  usersURL = 'http://localhost:8080/user';
  API_URL = 'http://localhost:8080/api/test/';


  constructor(private http: HttpClient) {
  }
  getPublicContent(): Observable<any> {
    return this.http.get(this.API_URL + 'all', { responseType: 'text' });
  }

  getUsers() {
    return this.http.get<User[]>(this.usersURL + '/all');
  }

  getUserById(id: number) {
    return this.http.get<User>(this.usersURL + '/details/' + id);
  }

  // register
  insertUser(user) {
    return this.http.post<User>(this.usersURL + '/insert', user);
  }

  getUserImageById(id: number) {
    return this.http.get<Image>(this.usersURL + '/image/' + id);
  }

  makeUserModerator(user) {
    return this.http.put<User>(this.usersURL + '/updaterole', user);
  }

  deleteImageById(id: number){
    return this.http.delete('http://localhost:8080/city/images/remove/'+id);
  }

  deleteUser(id:number){
    return this.http.delete<any>(this.usersURL + '/remove/' +id);
  }
 /* editUser( user): Observable<any> {
    return this.http.put<User>(this.usersURL + '/update' , user, this.httpOptions);
  }*/
  /*register(user): Observable<any> {
    return this.http.post(AUTH_API + 'signup', user /!*{
     username: user.username,
     email: user.email,
     password: user.password
     }*!/, httpOptions);
  }*/

  // login
  /* loginUser(username: string) {
   // username.toString();
   return this.http.post<any>(this.usersURL + '/login/{username}', username);
   }*/
  loginUser (user) {

this.http.post<Observable<boolean>>(this.usersURL + '', {
  userName: user.username,
  password: user.password
}).subscribe(isValid => {
  if (isValid) {
    sessionStorage.setItem(
      'token',
      btoa(user.username + ':' + user.password)
    );

    /*this.router.navigate(['']);*/
  } else {
    alert('Authentication failed.');
  }
});
}
}
