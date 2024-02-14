import { Component, Input, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { Banner } from './../../interfaces/banner.interface';
import { IonicSlides, IonicModule } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common';

register();

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BannerComponent  implements OnInit {

  swiperModules = [IonicSlides];
  @Input() bannerImages: Banner[];

  constructor(private router: Router) { }

  ngOnInit() {}
  
  goToRestaurant(data) {
    if(data?.restaurant_id) {
      this.router.navigate(['/', 'tabs', 'restaurants', data.restaurant_id]);
    }
  }

}
