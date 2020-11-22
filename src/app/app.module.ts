import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatIconModule, MatMenuModule, MatToolbarModule, MatButtonModule, MatTableModule} from '@angular/material';
import {RouterModule} from '@angular/router';
// import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {UsersComponent} from './user/users/users.component';
import {HomeComponent} from './home/home.component';
import {UserDetailsComponent} from './user/user-details/user-details.component';
import {HttpClientModule} from '@angular/common/http';
import {HeaderComponent} from './header/header.component';
import {AddUserComponent} from './user/add-user/add-user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login/login.component';
import {AuthGaurdService} from './services/auth.guard';
import {LogoutComponent} from './logout/logout.component';
import {MapDirectionsComponent} from './map/map-directions/map-directions.component';
import {MapHomeComponent} from './map/map-home/map-home.component';
import { CitiesComponent } from './city/cities/cities.component';
import {HotelsComponent} from './hotel/hotels/hotels.component';
import {CityAllComponent} from './city/city-all/city-all.component';
import {HotelPageComponent} from './hotel/hotel-page/hotel-page.component';
import {authInterceptorProviders} from './services/auth.interceptor';
import {EditUserComponent} from './user/edit-user/edit-user.component';
import {AddCityComponent} from './city/city-add/city-add.component';
import {EditCityComponent} from './city/city-edit/city-edit.component';
import {AddEventComponent} from './event/event-add/event-add.component';
import {EditEventComponent} from './event/event-edit/event-edit.component';
import {AddHotelComponent} from './hotel/hotel-add/hotel-add.component';
import {EditHotelComponent} from './hotel/hotel-edit/hotel-edit.component';
import {AddRestaurantComponent} from './restaurant/restaurant-add/restaurant-add.component';
import {EditRestaurantComponent} from './restaurant/restaurant-edit/restaurant-edit.component';
import {AddTouristAttractionComponent} from './touristAttraction/touristAttraction-add/touristAttraction-add.component';
import {EditTouristAttractionComponent} from './touristAttraction/touristAttraction-edit/touristAttraction-edit.component';
import {AddTypeOfFoodComponent} from './typeOfFood/typeOfFood-add/typeOfFood-add.component';
import {EditTypeOfFoodComponent} from './typeOfFood/typeOfFood-edit/typeOfFood-edit.component';
import {AddCommentComponent} from './comment/comment-add/comment-add.component';
import {EditCommentComponent} from './comment/comment-edit/comment-edit.component';
import {OrderByPipe} from './services/order-by.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {EventPageComponent} from "./event/event-page/event-page.component";
import {RestaurantPageComponent} from "./restaurant/restaurant-page/restaurant-page.component";
import {TouristAttractionPageComponent} from "./touristAttraction/touristAttraction-page/touristAttraction-page.component";
import {ToastrModule} from "ngx-toastr";
import {EditReservationComponent} from './reservation/reservation-edit/reservation-edit.component'
import {AddReservationComponent} from './reservation/reservation-add/reservation-add.component'
import {Role} from "./model/role";
import {UserProfileComponent} from "./user/user-profile/user-profile.component";
import {EditUserProfileComponent} from "./user/edit-user-profile/edit-user-profile.component";




@NgModule({
  declarations: [

    AppComponent,
    UsersComponent,
    HomeComponent,
    AddUserComponent,
    EditUserComponent,
    LoginComponent,
    LogoutComponent,
    UserDetailsComponent,
    HeaderComponent,
    MapDirectionsComponent,
    MapHomeComponent,
    CitiesComponent,
    AddCityComponent,
    EditCityComponent,
    HotelsComponent,
    AddHotelComponent,
    EditHotelComponent,
    CityAllComponent,
    HotelPageComponent,
    EventPageComponent,
    AddEventComponent,
    EditEventComponent,
    RestaurantPageComponent,
    AddRestaurantComponent,
    EditRestaurantComponent,
    TouristAttractionPageComponent,
    AddTouristAttractionComponent,
    EditTouristAttractionComponent,
    AddTypeOfFoodComponent,
    EditTypeOfFoodComponent,
    AddCommentComponent,
    EditCommentComponent,
    AddReservationComponent,
    EditReservationComponent,
    OrderByPipe,
    OrderByPipe,
    UserProfileComponent,
    EditUserProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),

   // AppRoutingModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole]
        }
      },

      {
        path: 'cities',
        component: CitiesComponent
      },
      {
        path: 'city/:id',
        component: CityAllComponent
        //canActivate:[AuthGaurdService]
      },
      {
        path: 'cities/insert',
        component: AddCityComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
     {
      path: 'cities/edit/:id',
      component: EditCityComponent,
       canActivate:[AuthGaurdService],
       data: {
         roles:[Role.AdminRole,Role.ModRole]
       }
      },
      {
        path: 'user/:id',
        component: UserDetailsComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole]
        }
      },
      {
        path: 'profile',
        component: UserProfileComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.UserRole,Role.ModRole]
        }
      },
      {
        path: 'profile/editprofile',
        component: EditUserProfileComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.UserRole,Role.ModRole]
        }
      },
      {
        path: 'insert',
        component: AddUserComponent,
       /* canActivate: [AuthGaurdService]*/
      },
      {
        path: 'login',
        component: LoginComponent

      },
      { path: 'logout',
        component: LogoutComponent,
        /*canActivate: [AuthGaurdService]*/
      },
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'map-directions',
        component: MapDirectionsComponent
      },
      {
        path: 'hotels',
        component: HotelsComponent
      },
      {
        path: 'hotel/:id',
        component: HotelPageComponent
      },
      {
        path: 'hotels/add/:id',
        component: AddHotelComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'hotels/edit/:id',
        component: EditHotelComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'map-home',
        component: MapHomeComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'edit/:id',
        component: EditUserComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole]
        }
      },
      {
        path: 'event/:id',
        component: EventPageComponent
      },
      {
        path: 'event/insert/:id',
        component: AddEventComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'event/edit/:id',
        component: EditEventComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'restaurant/:id',
        component: RestaurantPageComponent,

      },
      {
        path: 'restaurant/insert/:id',
        component: AddRestaurantComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'touristAttraction-page/:id',
        component: TouristAttractionPageComponent

      },
      {
        path: 'restaurant/edit/:id',
        component: EditRestaurantComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'touristAttraction-page/add/:id',
        component: AddTouristAttractionComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'touristAttraction-page/edit/:id',
        component: EditTouristAttractionComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'typeoffood/add',
        component: AddTypeOfFoodComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'typeoffood/edit',
        component: EditTypeOfFoodComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole]
        }
      },
      {
        path: 'comment/add/:id',
        component: AddCommentComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole,Role.UserRole]
        }

      },
      {
        path: 'comment/edit',
        component: EditCommentComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole,Role.UserRole]
        }
      },
      {
        path: 'reservation/add/:id',
        component: AddReservationComponent,
        //canActivate:[AuthGaurdService],
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole,Role.UserRole]
        }

      },
      {
        path: 'reservation/edit/:id',
        component: EditReservationComponent,
        canActivate:[AuthGaurdService],
        data: {
          roles:[Role.AdminRole,Role.ModRole,Role.UserRole]
        }
      },

      // otherwise redirect to home
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule {
}
