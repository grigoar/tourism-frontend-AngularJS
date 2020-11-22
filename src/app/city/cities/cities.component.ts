import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {City} from "../../model/city";
import {CityService} from "../../services/cities.service";
import {Image} from "../../model/image";
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "../../services/token-storage.service";


@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit  {

  url: string;
  cities: City[] = [];
  displayedColumns: string[] = ['Name', 'Image','Description','Country','ID'];

  cityImage:Image = null;

  //pentru verificarea daca utilizatorul este logat
  private rolesuser: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username: string;
  userid: number;
  constructor(private router: Router, private cityService: CityService,private tokenStorageService: TokenStorageService, private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.rolesuser = user.roles;

      this.showAdminBoard = this.rolesuser.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.rolesuser.includes('ROLE_MODERATOR');

      this.username = user.username;
      this.userid = user.id;

    }

    this.cityService.getCities()
      .subscribe(data => {
        this.cities = data;
        for(let i=0;i<this.cities.length;i++){
          this.cityService.getCityImageById(this.cities[i].id)
            .subscribe(data1=> {
              this.cityImage=data1;
              this.cities[i].pic=this.cityImage.pic;
            });
        }
      });


  }

  viewDetails(id: number): void {
    this.router.navigate(['city', id]);
}

  /*onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.url = (<FileReader>event.target).result;
      //  this.url = FileReader.result;
      }
    }
  }*/
  addCity(){
    this.router.navigate(['cities/insert']);
  }

}
