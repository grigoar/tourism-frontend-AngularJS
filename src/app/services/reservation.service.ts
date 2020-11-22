import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Reservation} from "../model/reservation";

@Injectable({

  providedIn: 'root'
})
export class ReservationService {

  reservationURL = 'http://localhost:8080/reservation';

  constructor(private http: HttpClient) {
  }

  getReservations() {
    return this.http.get<Reservation[]>(this.reservationURL + '/all');
  }

  getReservationById(id: number) {
    return this.http.get<Reservation>(this.reservationURL + '/details/' + id);
  }

  // register
  insertReservation(reservation) {
    return this.http.post<any>(this.reservationURL + '/insert', reservation);
  }
  editReservation(reservation) {
    return this.http.put<Reservation>(this.reservationURL + '/edit', reservation);
  }
  getAllReservationsFromHotelById(hotelid: number) {
    return this.http.get<Reservation[]>(this.reservationURL + '/hotel/' + hotelid);
  }
  getAllReservationsFromRestaurantById(restaurantid: number) {
    return this.http.get<Reservation[]>(this.reservationURL + '/restaurant/' + restaurantid);
  }
  getUserReservationsRestaurant(userid:number,restaurantid: number) {
    return this.http.get<Reservation[]>(this.reservationURL + '/restaurant/' + userid+'/'+restaurantid);
  }
  getUserReservationsHotel(userid:number,hotelid: number) {
    return this.http.get<Reservation[]>(this.reservationURL + '/hotel/' + userid+'/'+hotelid);
  }
  deleteReservation(id:number){
    return this.http.delete<any>(this.reservationURL + '/remove/' +id);
  }

}
