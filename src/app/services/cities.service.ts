
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {City} from '../model/city';
import {User} from '../model/user';
import {stringify} from 'querystring';
import {Observable} from 'rxjs/index';
import {Image} from "../model/image";

@Injectable({
  providedIn: 'root'
})
export class CityService {

  cityURL = 'http://localhost:8080/city';

  constructor(private http: HttpClient) {
  }

  getCities() {
    return this.http.get<City[]>(this.cityURL + '/all');
  }

  getCityById(id: number) {
    return this.http.get<City>(this.cityURL + '/details/' + id);
  }

  // register
  insertCity(city) {
    return this.http.post<City>(this.cityURL + '/insert', city);
  }
  editCity(city) {
    return this.http.put<City>(this.cityURL + '/edit', city);
  }
  getCityImageById(id: number) {
    return this.http.get<Image>(this.cityURL + '/image/' + id);
  }
  getAllCityImagesById(id: number) {
    return this.http.get<Image[]>(this.cityURL + '/images/all/' + id);
  }
  deleteCity(id:number){
    return this.http.delete<any>(this.cityURL + '/remove/' +id);
  }

}
