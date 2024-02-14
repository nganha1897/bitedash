import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
import { Subscription } from 'rxjs';
import { RestaurantComponent } from 'src/app/components/restaurant/restaurant.component';
import { LoadingRestaurantComponent } from 'src/app/components/loading-restaurant/loading-restaurant.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, RestaurantComponent, LoadingRestaurantComponent, EmptyScreenComponent]
})
export class SearchPage implements OnInit, OnDestroy {

  @ViewChild('searchInput') sInput;
  model: any = {
    icon: 'search-outline',
    title: 'No Restaurants Record Found'
  };
  isLoading: boolean;
  query: any;
  restaurants: Restaurant[] = [];
  location: any = {};
  addressSub: Subscription;
  data: any;
  page = 1;

  constructor(
    private addressService: AddressService,
    private global: GlobalService,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.sInput.setFocus();
    }, 500);
    this.addressSub = this.addressService.addressChange.subscribe(address => {
      if(address && address?.lat) this.location = address;
    });
  }

  async onSearchChange(event) {
    this.query = event.detail.value.toLowerCase();
    this.restaurants = [];
    if(this.query.length > 0) {
      this.isLoading = true;
      try {
        if(this.location && this.location?.lat) {
          const radius = this.addressService.radius;
          const data = {
            lat: this.location.lat,
            lng: this.location.lng,
            radius,
            name: this.query
          };
          this.data = await this.restaurantService.searchNearbyRestaurants(data);
          if(this.data) this.restaurants = this.restaurants.concat(this.data?.restaurants);
        } else {
          this.global.errorToast('Please select your location to proceed with the search...');
        }
        this.isLoading = false;
      } catch(e) {
        this.isLoading = false;
        this.global.checkMessageForErrorToast(e);
      }
    }
  }

  async loadMore(event) {
    try {
      this.page++;
      // call functionality within settimeout of 2 secs for showing loader properly
      setTimeout(async() => {
        const perPage = this.data.perPage;
        const nextPage = this.data.nextPage;
        if(nextPage) {
          const radius = this.addressService.radius;
          const data = {
            lat: this.location.lat,
            lng: this.location.lng,
            radius,
            name: this.query,
            page: this.page
          };
          this.data = await this.restaurantService.searchNearbyRestaurants(data);
          if(this.data) this.restaurants = this.restaurants.concat(this.data?.restaurants);
        }
        event.target.complete();
        if(this.data?.restaurants?.length < perPage) {
          this.global.infoToast('All restaurants fetched successfully!');
          event.target.disabled = true
        };
      }, 2000);
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
    }
  }

  ngOnDestroy() {
      if(this.addressSub) this.addressSub.unsubscribe();
  }

}