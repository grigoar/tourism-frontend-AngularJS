import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {User} from '../model/user';
import {Event} from '../model/event';
import {stringify} from 'querystring';
import {Observable} from 'rxjs/index';
import {Image} from "../model/image";
import {UsersEvents} from "../model/usersEvents";

@Injectable({

  providedIn: 'root'
})
export class EventService {

  eventsURL = 'http://localhost:8080/event';

  constructor(private http: HttpClient) {
  }

  getEvents() {
    return this.http.get<Event[]>(this.eventsURL + '/all');
  }

  getEventById(id: number) {
    return this.http.get<Event>(this.eventsURL + '/details/' + id);
  }

  // register
  insertEvent(event) {
    return this.http.post<Event>(this.eventsURL + '/insert', event);
  }
  editEvent(event) {
    return this.http.put<Event>(this.eventsURL + '/edit', event);
  }
  // adaugare in baza de date numarul de oameni goin.maybe going la un event
  editEventGM(event) {
    return this.http.put<Event>(this.eventsURL + '/editGM', event);
  }
  getEventsFromCity(id: number) {
    return this.http.get<Event[]>(this.eventsURL + '/all/' + id);
  }

  getAllEventImagesById(id: number) {
    return this.http.get<Image[]>(this.eventsURL + '/images/all/' + id);
  }

  addUsersEvents(usersEvent){
    return this.http.post<UsersEvents>(this.eventsURL + '/adduserevent', usersEvent);
  }

  deleteEvent(id:number){
    return this.http.delete<any>(this.eventsURL + '/remove/' +id);
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
