import {Component, OnInit} from '@angular/core';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {Hotel} from "../../model/hotel";
import {HotelService} from "../../services/hotel.service";

@Component({
  selector: 'app-hotel-add',
  templateUrl: './hotel-add.component.html',
  styleUrls: ['./hotel-add.component.css']
})
export class AddHotelComponent implements OnInit  {

  hotel: Hotel = new Hotel();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  sub:any;
  cityid:number;

  constructor(private router: Router, private hotelService: HotelService, private route: ActivatedRoute) { }
  ngOnInit() {
  }

  onSubmit() {
    this.sub = this.route.params.subscribe(params => {
      this.cityid = +params['id'];
      this.hotel.city_id=this.cityid;
      this.hotelService.insertHotel(this.hotel)
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
