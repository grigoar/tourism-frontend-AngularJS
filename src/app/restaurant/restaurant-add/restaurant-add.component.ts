import {Component, OnInit} from '@angular/core';

import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {Restaurant} from "../../model/restaurant";
import {RestaurantService} from "../../services/restaurant.service";



@Component({
  selector: 'app-restaurant-add',
  templateUrl: './restaurant-add.component.html',
  styleUrls: ['./restaurant-add.component.css']
})
export class AddRestaurantComponent implements OnInit {

  restaurant: Restaurant = new Restaurant();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  cityid: number;
  sub: any;

  constructor(private router: Router, private restaurantService: RestaurantService, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.sub = this.route.params.subscribe(params => {
      this.cityid = +params['id'];
      this.restaurant.city_id = this.cityid;
      this.restaurantService.insertRestaurant(this.restaurant)
        .subscribe(data => this.router.navigate(['city/' + this.cityid]));
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
