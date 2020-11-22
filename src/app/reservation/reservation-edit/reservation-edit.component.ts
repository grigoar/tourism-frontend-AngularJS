import {Component, OnInit} from '@angular/core';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {Comment} from "../../model/comment";
import {CommentService} from "../../services/comment.service";
import {Reservation} from "../../model/reservation";
import {ReservationService} from "../../services/reservation.service";
import {User} from "../../model/user";




@Component({
  selector: 'app-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrls: ['./reservation-edit.component.css']
})
export class EditReservationComponent implements OnInit  {

  comment: Comment = new Comment();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  reservationid:number;
  reservation:Reservation=null;
  sub:any;

  roles:string[]=[];

  showEndDate=true;

  constructor(private router: Router, private commentService: CommentService, private reservationService:ReservationService, private route:ActivatedRoute) { }
  ngOnInit() {
   /* //trebuie modificat sa faca edit la orasul care trebuie=> pus butonul de edit unde trebuie
    this.cityService.getCityById(1) .subscribe(data => {
      this.city = data;
    });*/

    this.sub = this.route.params.subscribe(params => {
      this.reservationid = +params['id'];
      this.reservationService.getReservationById(this.reservationid)
        .subscribe(data => {
          this.reservation = data;
          if(this.reservation.restaurant_id!=0) this.showEndDate=false;
            else this.showEndDate=true;
        });
    });
  }

  editReservation() {
    if(this.reservation.hotel_id!=0){
      this.reservation.user=new User();
    //  this.userRoles();
      this.reservationService.editReservation(this.reservation)
        .subscribe(data => this.router.navigate(['hotel/'+this.reservation.hotel_id]));
    } else if(this.reservation.restaurant_id!=0){
     // this.userRoles();
      this.reservation.user=new User();
      this.reservationService.editReservation(this.reservation)
        .subscribe(data => this.router.navigate(['restaurant/'+this.reservation.restaurant_id]));
    }

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

  userRoles(){
    if (this.reservation.user.roles[0] != null && this.reservation.user.roles[1] != null && this.reservation.user.roles[2] != null) {
      this.roles.push("user");
      this.roles.push("mod");
      this.roles.push("admin");
      this.reservation.user.roles = this.roles;
    } else if (this.reservation.user.roles[0] != null && this.reservation.user.roles[1] != null) {
      this.roles.push("user");
      this.roles.push("mod");
      this.reservation.user.roles = this.roles;
    } else {
      this.roles.push("user");
      this.reservation.user.roles = this.roles;
    }
    console.log("role 1: " + this.roles[0] + " role 2: " + this.roles[1] + " role 3: " + this.roles[2]);
    // console.log("role 1: "+this.roles[0]);
    console.log("roluri " + JSON.stringify(this.reservation.user));
  }
}
