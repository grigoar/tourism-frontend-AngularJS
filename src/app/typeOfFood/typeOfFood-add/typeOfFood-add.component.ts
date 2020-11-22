import {Component, OnInit} from '@angular/core';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {TypeOfFood} from "../../model/typeOfFood";
import {TypeOfFoodService} from "../../services/typeOfFood.service";


@Component({
  selector: 'app-typeOfFood-add',
  templateUrl: './typeOfFood-add.component.html',
  styleUrls: ['./typeOfFood-add.component.css']
})
export class AddTypeOfFoodComponent implements OnInit  {

  typeOfFood: TypeOfFood = new TypeOfFood();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private router: Router, private typeOfFoodService: TypeOfFoodService) { }
  ngOnInit() {
  }

  onSubmit() {
    this.typeOfFoodService.insertTypeOfFood(this.typeOfFood)
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
