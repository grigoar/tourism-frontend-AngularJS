import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {City} from "../../model/city";
import {CityService} from "../../services/cities.service";
import {HttpClient} from "@angular/common/http";



@Component({
  selector: 'app-city-add',
  templateUrl: './city-add.component.html',
  styleUrls: ['./city-add.component.css']
})
export class AddCityComponent  implements OnInit  {

 // url: string;
 // result: any;
  city: City = new City();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';






  constructor(private router: Router, private cityService: CityService,
              private httpClient: HttpClient) { }
  ngOnInit() {
  }

  onSubmit() {
    this.cityService.insertCity(this.city)
      .subscribe(data => this.router.navigate(['cities']));
  }



  /*onSelectFile(event) { // called each time file input changes
    let target : EventTarget;
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        // this.url = (<FileReader>event.target).result;
        this.url = (event.target as FileReader).result + '';
       // this.url = reader.result.toString;
      }
    }
  }*/

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
