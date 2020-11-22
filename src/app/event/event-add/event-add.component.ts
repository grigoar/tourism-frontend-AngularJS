import {Component, OnInit} from '@angular/core';

import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {EventService} from "../../services/event.service";


@Component({
  selector: 'app-event-add',
  templateUrl: './event-add.component.html',
  styleUrls: ['./event-add.component.css']
})
export class AddEventComponent implements OnInit  {

  event: Event = new Event();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  cityid:number;
  sub:any;

  constructor(private router: Router, private eventService: EventService, private route:ActivatedRoute) { }
  ngOnInit() {
    this.event.start_time="2020-06-25T19:30";
  }

  onSubmit() {
    this.sub = this.route.params.subscribe(params => {
      this.cityid = +params['id'];
      this.event.city_id=this.cityid;
      this.eventService.insertEvent(this.event)
        .subscribe(data => this.router.navigate(['city/'+this.cityid]));
    });
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
