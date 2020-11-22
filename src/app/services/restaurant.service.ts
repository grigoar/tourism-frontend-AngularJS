import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {User} from '../model/user';
import {Restaurant} from '../model/restaurant';
import {stringify} from 'querystring';
import {Observable} from 'rxjs/index';
import {Image} from "../model/image";

@Injectable({

  providedIn: 'root'
})
export class RestaurantService {

  restaurantsURL = 'http://localhost:8080/restaurant';

  constructor(private http: HttpClient) {
  }

  getRestaurants() {
    return this.http.get<Restaurant[]>(this.restaurantsURL + '/all');
  }

  getRestaurantById(id: number) {
    return this.http.get<Restaurant>(this.restaurantsURL + '/details/' + id);
  }

  // register
  insertRestaurant(restaurant) {
    return this.http.post<Restaurant>(this.restaurantsURL + '/insert', restaurant);
  }
  editRestaurant(restaurant) {
    return this.http.put<Restaurant>(this.restaurantsURL + '/edit', restaurant);
  }
  getRestaurantsFromCity(id: number) {
    return this.http.get<Restaurant[]>(this.restaurantsURL + '/all/' + id);
  }
  getAllRestaurantImagesById(id: number) {
    return this.http.get<Image[]>(this.restaurantsURL + '/images/all/' + id);
  }

  deleteRestaurant(id:number){
    return this.http.delete<any>(this.restaurantsURL + '/remove/' +id);
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
