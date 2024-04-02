import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { cart, order } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  totalPrice: number | undefined;
  cartdata: cart[] | undefined;
  orderMsg: string | undefined;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.currentCart().subscribe((result) => {
      this.cartdata = result;
      // let price = 50000;
      let price = 0;

      result.forEach((item) => {
        if (item.quantity) {
          price = price + +item.price * +item.quantity;
        }
      });
      this.totalPrice = price + price / 10 + 100 - price / 10;
      // this.totalPrice = price;

      console.warn('totalPrice', this.totalPrice);
    });
  }

  orderNow(data: { email: string; address: string; mobile: number }) {
    let user = localStorage.getItem('user-auth');
    let userId = user && JSON.parse(user).id;

    if (this.totalPrice) {
      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id: undefined,
      };
      this.cartdata?.forEach((item) => {
        setTimeout(() => {
          item.id && this.productService.deleteCartItems(item.id);
        }, 700);
      });

      this.productService.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = 'Your has been order placed';
          // alert('order placed');
          setTimeout(() => {
            this.router.navigateByUrl('/my-order');
            this.orderMsg = undefined;
          }, 4000);
        }
      });
    }
  }
}
