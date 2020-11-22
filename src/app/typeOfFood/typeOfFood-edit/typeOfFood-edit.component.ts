import {Component, OnInit} from '@angular/core';
import {Event} from '../../model/event';
import {ActivatedRoute, Router} from '@angular/router';
import {TypeOfFood} from "../../model/typeOfFood";
import {TypeOfFoodService} from "../../services/typeOfFood.service";



@Component({
  selector: 'app-typeOfFood-edit',
  templateUrl: './typeOfFood-edit.component.html',
  styleUrls: ['./typeOfFood-edit.component.css']
})
export class EditTypeOfFoodComponent implements OnInit  {

  typeOfFood: TypeOfFood = new TypeOfFood();
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private router: Router, private typeOfFoodService: TypeOfFoodService) { }
  ngOnInit() {
    /*//trebuie modificat sa faca edit la orasul care trebuie=> pus butonul de edit unde trebuie
     this.cityService.getCityById(1) .subscribe(data => {
     this.city = data;
     });*/

  }

  onSubmit() {
    this.typeOfFoodService.editTypeOfFood(this.typeOfFood)
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
