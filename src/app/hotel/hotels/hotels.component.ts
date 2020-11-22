import { Component, OnInit } from '@angular/core';

import {Router} from '@angular/router';
import {Hotel} from "../../model/hotel";
import {HotelService} from "../../services/hotel.service";

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  styleUrls: ['./hotels.component.css']
})
export class HotelsComponent implements OnInit {

  hotels: Hotel[] = [];
  displayedColumns: string[] = ['Name', 'Address', 'Details', 'Contact', 'Website'];

  constructor(private router: Router, private hotelService: HotelService) {
  }

  ngOnInit() {
    this.hotelService.getHotels()
      .subscribe(data => {
        this.hotels = data;
      });
  }

  /*viewDetails(id: number): void {
    this.router.navigate(['city', id]);
}*/

}
