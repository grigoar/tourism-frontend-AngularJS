import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// import {User} from '../model/user';
import {Hotel} from '../model/hotel';
import {Comment} from '../model/comment';
import {stringify} from 'querystring';
import {Observable} from 'rxjs/index';

@Injectable({

  providedIn: 'root'
})
export class CommentService {

  commentsURL = 'http://localhost:8080/comments';

  constructor(private http: HttpClient) {
  }

  getComments() {
    return this.http.get<Comment[]>(this.commentsURL + '/all');
  }

  getCommentById(id: number) {
    return this.http.get<Comment>(this.commentsURL + '/details/' + id);
  }

  // register
  insertComment(comment) {
    return this.http.post<Hotel>(this.commentsURL + '/insert', comment);
  }
  editComment(comment) {
    return this.http.put<Hotel>(this.commentsURL + '/edit', comment);
  }
  getCommentsFromHotel(id: number) {
    return this.http.get<Comment[]>(this.commentsURL + '/hotel/' + id);
  }
  getCommentsFromRestaurant(id: number) {
    return this.http.get<Comment[]>(this.commentsURL + '/restaurant/' + id);
  }
  getCommentsFromEvent(id: number) {
    return this.http.get<Comment[]>(this.commentsURL + '/event/' + id);
  }
  getCommentsFromTouristAttraction(id: number) {
    return this.http.get<Comment[]>(this.commentsURL + '/touristAttraction/' + id);
  }

  getCommentsRatingForHotel(id: number){
    return this.http.get<any>(this.commentsURL + '/hotel/statistics/' +id);
  }
  getCommentsRatingForRestaurant(id: number){
    return this.http.get<any>(this.commentsURL + '/restaurant/statistics/' +id);
  }
  getCommentsRatingForTouristAttraction(id: number){
    return this.http.get<any>(this.commentsURL + '/touristAttraction/statistics/' +id);
  }

  deleteComment(id:number){
    return this.http.delete<any>(this.commentsURL + '/remove/' +id);
  }
 /* getCommentsRatingForHotel(id: number){
    return this.http.get<[]>(this.commentsURL + '/touristAttraction/' + id);
  }*/
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
