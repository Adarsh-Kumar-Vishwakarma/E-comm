import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { cart, priceSummary } from '../data-type';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };
  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  removeToCart(cartId: number | undefined) {
    cartId &&
      this.cartData &&
      this.productService.removeToCart(cartId).subscribe((result) => {
        this.loadDetails();
      });
  }

  loadDetails() {
    this.productService.currentCart().subscribe({
      next: (result) => {
        this.cartData = result;
        console.warn(this.cartData);
        let price = 0;
  
        result.forEach((item) => {
          if (item.quantity && item.price) {
            price += (+item.price * +item.quantity);
          }
        });
  
        const tax = price * 0.1;
        const discount = price * 0.1;
        const delivery = 40;
        const total = price + tax - discount + delivery;
  
        this.priceSummary = {
          price: price,
          tax: tax,
          discount: discount,
          delivery: delivery,
          total: total,
        };
  
        console.warn(this.priceSummary);
  
        if (!this.cartData.length) {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.error('Error fetching cart data:', err);
      }
    });
  }
  

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
