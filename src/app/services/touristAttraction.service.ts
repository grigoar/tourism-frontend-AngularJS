import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {User} from '../model/user';

import {stringify} from 'querystring';
import {Observable} from 'rxjs/index';
import {TouristAttraction} from '../model/touristAttraction';
import {Image} from "../model/image";

@Injectable({

  providedIn: 'root'
})
export class TouristAttractionService {

  touristAttractionsURL = 'http://localhost:8080/touristAttraction';

  constructor(private http: HttpClient) {
  }

  getTouristAttractions() {
    return this.http.get<TouristAttraction[]>(this.touristAttractionsURL + '/all');
  }

  getTouristAttractionById(id: number) {
    return this.http.get<TouristAttraction>(this.touristAttractionsURL + '/details/' + id);
  }

  // register
  insertTouristAttraction(touristAttraction) {
    return this.http.post<TouristAttraction>(this.touristAttractionsURL + '/insert', touristAttraction);
  }
  editTouristAttraction(touristAttraction) {
    return this.http.put<TouristAttraction>(this.touristAttractionsURL + '/edit', touristAttraction);
  }
  getTouristAttractionsFromCity(id: number) {
    return this.http.get<TouristAttraction[]>(this.touristAttractionsURL + '/all/' + id);
  }

  getAllTouristAttractionImagesById(id: number) {
    return this.http.get<Image[]>(this.touristAttractionsURL + '/images/all/' + id);
  }

  deleteTouristAttraction(id:number){
    return this.http.delete<any>(this.touristAttractionsURL + '/remove/' +id);
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
