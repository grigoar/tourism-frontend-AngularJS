import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {User} from '../model/user';
import {Hotel} from '../model/hotel';
import {stringify} from 'querystring';
import {Observable} from 'rxjs/index';
import {Image} from "../model/image";

@Injectable({

  providedIn: 'root'
})
export class HotelService {

  hotelsURL = 'http://localhost:8080/hotel';

  constructor(private http: HttpClient) {
  }

  getHotels() {
    return this.http.get<Hotel[]>(this.hotelsURL + '/all');
  }

  getHotelById(id: number) {
    return this.http.get<Hotel>(this.hotelsURL + '/details/' + id);
  }

  // register
  insertHotel(hotel) {
    return this.http.post<Hotel>(this.hotelsURL + '/insert', hotel);
  }
  editHotel(hotel) {
    return this.http.put<Hotel>(this.hotelsURL + '/edit', hotel);
  }
  getHotelsFromCity(id: number) {
    return this.http.get<Hotel[]>(this.hotelsURL + '/all/' + id);
  }

  getAllHotelImagesById(id: number) {
    return this.http.get<Image[]>(this.hotelsURL + '/images/all/' + id);
  }

  deleteHotel(id:number){
    return this.http.delete<any>(this.hotelsURL + '/remove/' +id);
  }
  // login
  /* loginUser(username: string) {
   // username.toString();
   return this.http.post<any>(this.usersURL + '/login/{username}', username);
   }*/
 /* loginUser (user) {

this.http.post<Observable<boolean>>(this.usersURL + '', {
  userName: user.username,
  password: user.password
}).subscribe(isValid => {
  if (isValid) {
    sessionStorage.setItem(
      'token',
      btoa(user.username + ':' + user.password)
    );

    /!*this.router.navigate(['']);*!/
  } else {
    alert('Authentication failed.');
  }
});
}*/
}
