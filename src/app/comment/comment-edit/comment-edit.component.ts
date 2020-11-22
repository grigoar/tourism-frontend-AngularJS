import {Component, OnInit} from '@angular/core';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {Comment} from "../../model/comment";
import {CommentService} from "../../services/comment.service";




@Component({
  selector: 'app-comment-edit',
  templateUrl: './comment-edit.component.html',
  styleUrls: ['./comment-edit.component.css']
})
export class EditCommentComponent implements OnInit  {

  comment: Comment = new Comment();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private router: Router, private commentService: CommentService) { }
  ngOnInit() {
   /* //trebuie modificat sa faca edit la orasul care trebuie=> pus butonul de edit unde trebuie
    this.cityService.getCityById(1) .subscribe(data => {
      this.city = data;
    });*/
  }

  onSubmit() {
    this.commentService.editComment(this.comment)
      .subscribe(data => this.router.navigate(['cities']));
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
