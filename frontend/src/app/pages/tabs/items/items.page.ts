import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GlobalService } from './../../../services/global/global.service';
import { MenuService } from './../../../services/menu/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { Restaurant } from 'src/app/models/restaurant.model';
import { Category } from 'src/app/models/category.model';
import { Item } from 'src/app/models/item.model';
import { Cart } from 'src/app/interfaces/cart.interface';
import { LoadingRestaurantComponent } from 'src/app/components/loading-restaurant/loading-restaurant.component';
import { EmptyScreenComponent } from 'src/app/components/empty-screen/empty-screen.component';
import { RestaurantDetailComponent } from 'src/app/components/restaurant-detail/restaurant-detail.component';
import { ItemComponent } from 'src/app/components/item/item.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule,
    FormsModule, 
    LoadingRestaurantComponent,
    EmptyScreenComponent,
    RestaurantDetailComponent,
    ItemComponent
  ]
})
export class ItemsPage implements OnInit, OnDestroy {

  id: string;
  data = {} as Restaurant;
  items: Item[] = [];
  veg: boolean = false;
  isLoading: boolean;
  cartData = {} as Cart;
  storedData = {} as Cart;
  model = {
    icon: 'fast-food-outline',
    title: 'No Menu Available'
  };
  categories: Category[] = [];
  allItems: Item[] = [];
  cartSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService,
    private menuService: MenuService,
    private global: GlobalService
  ) { }

  ngOnInit() {    
    const id = this.route.snapshot.paramMap.get('restaurantId');
    if(!id) {
      this.navCtrl.back();
      return;
    }
    this.id = id;
    
    this.cartSub = this.cartService.cart.subscribe(cart => {
      this.cartData = {} as Cart;
      this.storedData = {} as Cart
      if(cart && cart?.totalItem > 0) {
        this.storedData = cart;
        this.cartData.totalItem = this.storedData.totalItem;
        this.cartData.totalPrice = this.storedData.totalPrice;
        
        if(cart?.restaurant?._id === this.id) {
          this.allItems.forEach(element => {
            let qty = false;
            cart.items.forEach(element2 => {
              if(element._id != element2._id) return;
              element.quantity = element2.quantity;
              qty = true;
            });
            if(!qty && element.quantity) element.quantity = 0;
          });
          this.cartData.items = this.allItems.filter(x => x.quantity > 0);
          if(this.veg == true) this.items = this.allItems.filter(x => x.veg === true);
          else this.items = [...this.allItems];
        } else {
          this.allItems = this.allItems.map(element => {  
            return { ...element, quantity: 0 };
          });
          if(this.veg == true) this.items = this.allItems.filter(x => x.veg === true);
          else this.items = [...this.allItems];
        }
      } 
      
    });    
    this.getItems();
  }

  async getItems() {
    try {      
      this.isLoading = true;
      this.data = {} as Restaurant;
      this.cartData = {} as Cart;
      this.storedData = {} as Cart;
      const data: any = await this.menuService.getMenuItems(this.id);
      if(data) {
        this.data = {...data?.restaurant};
        this.categories = [...data.categories];
        this.allItems = [...data.items];
        this.items = [...this.allItems];
        await this.cartService.getCartData();
      }
      this.isLoading = false;
    } catch(e) {
      this.isLoading = false;
      this.global.checkMessageForErrorToast(e);
    }
  }

  vegOnly(event) {
    this.items = [];
    if(event.detail.checked == true) this.items = this.allItems.filter(x => x.veg === true);
    else this.items = this.allItems;
  }

  quantityPlus(item) {
    const index = this.allItems.findIndex(x => x._id === item._id);
    if(!this.allItems[index].quantity || this.allItems[index].quantity == 0) {
      if(!this.storedData.restaurant || (this.storedData.restaurant && this.storedData.restaurant._id == this.id)) {
        this.cartService.quantityPlus(index, this.allItems, this.data);
      } else {
        // alert for clear cart
        this.cartService.alertClearCart(index, this.allItems, this.data);
      }
    } else {
      this.cartService.quantityPlus(index, this.allItems, this.data);
    }  
  }

  quantityMinus(item) {
    const index = this.allItems.findIndex(x => x._id === item._id);
    this.cartService.quantityMinus(index, this.allItems);
  }

  checkItemCategory(id) {
    const item = this.items.find(x => x.category_id == id);
    if(item) return true;
    return false;
  }

  saveToCart() {
    try {
      this.cartData.restaurant = {} as Restaurant;
      this.cartData.restaurant = this.data;
      this.cartService.saveCart();
    } catch(e) {
      this.global.checkMessageForErrorToast(e);
    }
  }

  async viewCart() {
    if(this.cartData.items && this.cartData.items.length > 0) await this.saveToCart();
    this.router.navigate([this.router.url + '/cart']);
  }

  async ionViewWillLeave() {
    if(this.cartData?.items && this.cartData?.items.length > 0) await this.saveToCart();
  }

  ngOnDestroy() {
    if(this.cartSub) this.cartSub.unsubscribe();
  }
}