import {Component, OnInit} from '@angular/core';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {Comment} from '../../model/comment';
import {HotelService} from '../../services/hotel.service';
import {NgbRatingConfig} from "@ng-bootstrap/ng-bootstrap";
import {TokenStorageService} from "../../services/token-storage.service";
import {CommentService} from "../../services/comment.service";


@Component({
  selector: 'app-comment-add',
  templateUrl: './comment-add.component.html',
  styleUrls: ['./comment-add.component.css'],
  providers: [NgbRatingConfig] // add NgbRatingConfig to the component providers
})
export class AddCommentComponent implements OnInit  {

  comment: Comment = new Comment();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  hotelid: number;
  private sub: any;

  private roles: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  id: number;
  rating = 0;

  constructor(config: NgbRatingConfig, private tokenStorageService: TokenStorageService, private route: ActivatedRoute,
              private router: Router, private commentService: CommentService) {
    config.max = 5;
    // config.readonly = true;

  }


  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.hotelid = +params['id'];
      /*this.userService.getUserById(this.id)
        .subscribe(data => {
          this.user = data;
          this.roles = this.user.roles;
        });*/
    });
    // this.userrole = this.roles[0];}


    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.id = user.id;

    }

  }

  onSubmit(rating) {
    this.comment.rating = rating;
    this.comment.hotel_id = this.hotelid;
    this.comment.user_id = this.id;
    this.commentService.insertComment(this.comment)
      .subscribe(data => this.router.navigate(['hotel/', this.comment.hotel_id]).then(() => {
        window.location.reload();
      } ));
  }

  setValue(val: number){
    this.comment.rating = val;
  }
  /*insertUser(): void {

    this.userService.insertUser(this.user)
      .subscribe(data => this.router.navigate(['users']));
    /!* .subscribe( data => {
     alert('User created successfully.');
     });
     *!/
  }*/
  /*ngOnInit() {
   this.sub = this.route.params.subscribe(params => {
   // this.id = +params['id'];
   this.userService.insertUser()
   .subscribe(data => {
   this.user = data;
   });
   });
   }*/

}
