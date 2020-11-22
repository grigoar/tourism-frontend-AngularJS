import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {TouristAttraction} from "../../model/touristAttraction";
import {TouristAttractionService} from "../../services/touristAttraction.service";




@Component({
  selector: 'app-touristAttraction-add',
  templateUrl: './touristAttraction-add.component.html',
  styleUrls: ['./touristAttraction-add.component.css']
})
export class AddTouristAttractionComponent implements OnInit  {

  touristAttraction: TouristAttraction = new TouristAttraction();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  cityid:number;
  sub:any;

  constructor(private router: Router, private touristAttractionService: TouristAttractionService, private route: ActivatedRoute) { }
  ngOnInit() {
  }

  onSubmit() {
    this.sub = this.route.params.subscribe(params => {
      this.cityid = +params['id'];
      this.touristAttraction.city_id = this.cityid;
    this.touristAttractionService.insertTouristAttraction(this.touristAttraction)
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
