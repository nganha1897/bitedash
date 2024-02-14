import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RestaurantService } from 'src/app/services/restaurant/restaurant.service';
import { Banner } from './../../../interfaces/banner.interface';
import { BannerService } from './../../../services/banner/banner.service';
import { User } from './../../../models/user.model';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { NavigationExtras, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchLocationComponent } from 'src/app/components/search-location/search-location.component';
import { Address } from 'src/app/models/address.model';
import { Restaurant } from 'src/app/models/restaurant.model';
import { AddressService } from 'src/app/services/address/address.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { GoogleMapsService } from 'src/app/services/google-maps/google-maps.service';
import { LocationService } from 'src/app/services/location/location.service';
import { ModalController } from '@ionic/angular';
import { OtpScreenComponent } from 'src/app/components/otp-screen/otp-screen.component';
import { RestaurantComponent } from 'src/app/components/restaurant/restaurant.component';
import { LoadingRestaurantComponent } from 'src/app/components/loading-restaurant/loading-restaurant.component';
import { BannerComponent } from 'src/app/components/banner/banner.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    RouterModule, 
    OtpScreenComponent,
    RestaurantComponent,
    LoadingRestaurantComponent,
    BannerComponent
  ]
})
export class HomePage implements OnInit, OnDestroy {

  @ViewChild('otp_modal') modal: ModalController;
  banners: Banner[] = [];
  restaurants: Restaurant[] = [];
  isLoading: boolean = false;
  location = {} as Address;
  addressSub: Subscription;
  profile: User;
  // profileSub: Subscription;
  verifyOtp = false;
  data: any;
  page = 1;

  constructor(
    private router: Router,
    private addressService: AddressService,
    private global: GlobalService,
    private locationService: LocationService,
    private mapService: GoogleMapsService,
    private profileService: ProfileService,
    private bannerService: BannerService,
    private restaurantService: RestaurantService
  ) { }

  ngOnInit() {
    this.getProfile();
    this.addressSub = this.addressService.addressChange.subscribe({
      next: address => {
        if(address && address?.lat) {
          if(!this.isLoading) this.isLoading = true;
          this.location = address;
          this.nearbyApiCall();
        } else {
          if(address && (!this.location || !this.location?.lat)) {
            this.searchLocation('home', 'home-modal');
          }
        }
      }, error: e => {
        this.isLoading = false;
        this.global.errorToast();
      }
    });
    this.isLoading = true;
    this.getBanners();
    if(!this.location?.lat) {
      this.getNearbyRestaurants();
    }   
  }

  async getProfile() {
    try {
      this.profile = await this.profileService.getProfile();
      if(this.profile && !this.profile?.email_verified) {
        this.checkEmailVerified();
      }
    } catch(e) {
      this.global.errorToast();
    }
  }

  async checkEmailVerified() {
    const verify = await this.global.showButtonToast('Please verify your email address');
    if(verify) this.verifyOtp = true;
  }

  getBanners() {
    this.bannerService.getBanners().then(banners => {
      this.banners = banners;
    })
    .catch(e => {
      this.global.checkMessageForErrorToast(e);
    });
  }

  async nearbyApiCall() {
    try {
      const radius = this.addressService.radius;
      const data = {
        lat: this.location.lat,
        lng: this.location.lng,
        radius
      };
      this.data = await this.restaurantService.getNearbyRestaurants(data);
      if(this.data) this.restaurants = this.data?.restaurants;
      this.isLoading = false;
    } catch(e) {
      this.isLoading = false;
      this.global.checkMessageForErrorToast(e);
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
            page: this.page
          };
          this.data = await this.restaurantService.getNearbyRestaurants(data);
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

  async getNearbyRestaurants() {
    try {
      const position = await this.locationService.getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const address = await this.mapService.getAddress(latitude, longitude);
      if(address) {
        this.location = new Address(
          '',
          address.address_components[0].short_name,
          address.formatted_address,
          '',
          '',
          latitude,
          longitude
        );
        await this.getData();
      }
      this.isLoading = false;
    } catch(e) {
      this.global.errorToast();
      this.isLoading = false;
      this.searchLocation('home', 'home-modal');
    }
  }

  async getData() {
    try {
      this.restaurants = [];
      const address = await this.addressService.checkExistAddress(this.location);
    } catch(e) {
      this.global.errorToast();
    }
  }

  async searchLocation(prop, className?) {
    try {
      const options = {
        component: SearchLocationComponent,
        cssClass: className ? className : '',
        backdropDismiss: prop == 'select-place' ? true : false,
        componentProps: {
          from: prop
        }
      };
      const modal = await this.global.createModal(options);
      if(modal) {
        if(modal == 'add') {
          this.addAddress(this.location);
        } else if(modal == 'select') {
          this.searchLocation('select-place');
        } else {
          this.location = modal;
          await this.getData();
        }
      } else {
        if(!this.location || !this.location?.lat) {
          this.searchLocation('home', 'home-modal');
        }
      }
    } catch(e) {
      this.global.errorToast();
    }
  }

  addAddress(val?) {
    let navData: NavigationExtras;
    if(val) {
      val.from = 'home';      
    } else {
      val = {
        from: 'home'
      };
    }
    navData = {
      queryParams: {
        data: JSON.stringify(val)
      }
    }
    this.router.navigate(['/', 'tabs', 'address', 'edit-address'], navData);
  }

  resetOtpModal(value) {
    this.verifyOtp = false;
  }

  otpVerified(event) {
    if(event) this.modal.dismiss();
  }

  ngOnDestroy() {
    if(this.addressSub) this.addressSub.unsubscribe();
  }
}