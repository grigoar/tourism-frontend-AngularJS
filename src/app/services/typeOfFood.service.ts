import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {User} from '../model/user';
import {stringify} from 'querystring';
import {Observable} from 'rxjs/index';
import {TypeOfFood} from "../model/typeOfFood";

@Injectable({

  providedIn: 'root'
})
export class TypeOfFoodService {

  typeOfFoodURL = 'http://localhost:8080/typeoffood';

  constructor(private http: HttpClient) {
  }

  getTypeOfFoods() {
    return this.http.get<TypeOfFood[]>(this.typeOfFoodURL + '/all');
  }

  getTypeOfFoodById(id: number) {
    return this.http.get<TypeOfFood>(this.typeOfFoodURL + '/details/' + id);
  }

  // register
  insertTypeOfFood(typeOfFood) {
    return this.http.post<TypeOfFood>(this.typeOfFoodURL + '/insert', typeOfFood);
  }
  editTypeOfFood(typeOfFood) {
    return this.http.put<TypeOfFood>(this.typeOfFoodURL + '/edit', typeOfFood);
  }
  getTypeOfFoodFromRestaurant(id: number) {
    return this.http.get<TypeOfFood[]>(this.typeOfFoodURL + '/restaurant/' + id);
  }

  deleteTypeOfFood(id:number){
    return this.http.delete<any>(this.typeOfFoodURL + '/remove/' +id);
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
