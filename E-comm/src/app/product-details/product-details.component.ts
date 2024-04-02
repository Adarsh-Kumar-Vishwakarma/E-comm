import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { cart, product } from '../data-type';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;
  removeCart = false;
  iconrupee = faIndianRupeeSign;
  cartData: undefined | product;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let productId = this.activatedRoute.snapshot.paramMap.get('productId');
    // console.warn(productId);
    productId &&
      this.productService.getProduct(productId).subscribe((result) => {
        console.warn(result);
        this.productData = result;

        let cartData = localStorage.getItem('localCart');
        if (productId && cartData) {
          let items = JSON.parse(cartData);
          items = items.filter(
            (item: product) => productId == item.id.toString()
          );

          if (items.length) {
            this.removeCart = true;
          } else {
            this.removeCart = false;
          }
        }

        let user = localStorage.getItem('user-auth');
        if (user) {
          let userId = user && JSON.parse(user).id;
          this.productService.getCartList(userId);
          this.productService.cartData.subscribe((result) => {
            let item = result.filter(
              (item: product) =>
                productId?.toString === item.productId?.toString
            );
            if (item.length) {
              this.cartData = item[0];
              this.removeCart = true;
            }
          });
        }
      });
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 10 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'minus') {
      this.productQuantity -= 1;
    }
  }

  // addToCart() {
  //   if (this.productData) {
  //     this.productData.quantity = this.productQuantity;
  //     if (!localStorage.getItem('user-auth')) {
  //       console.warn('usernot logging');
  //       this.router.navigateByUrl('/user-auth');
  //     } else {
  //       console.warn('user logging');
  //       let user = localStorage.getItem('user-auth');
  //       let userId = user && JSON.parse(user).id;
  //       // let userName = user && JSON.parse(user).name;
  //       console.warn(userId);
  //       let cartData: cart = {
  //         ...this.productData,
  //         userId: userId,
  //         // userName: userName,
  //         productId: this.productData.id,
  //       };
  //       this.productService.localAddToCart(this.productData);
  //       // console.warn(this.productData);
  //       delete cartData.id;
  //       this.productService.addToCart(cartData).subscribe((result) => {
  //         if (result) {
  //           // alert('Product is added in cart');
  //           this.productService.getCartList(userId);
  //           this.removeCart = true;
  //         }

  //       });
  //       console.warn(cartData);
  //     }
  //   }
  // }

  addToCart() {
    if (this.productData) {
      // Set the quantity of the product
      this.productData.quantity = this.productQuantity;
  
      // Check if the user is logged in
      if (!localStorage.getItem('user-auth')) {
        // Redirect to the user authentication page if the user is not logged in
        console.warn('User not logged in');
        this.router.navigateByUrl('/user-auth');
      } else {
        // If the user is logged in
        // Add the product to the local cart
        this.productService.localAddToCart(this.productData);
        this.removeCart = true;
  
        // Retrieve the user ID from local storage
        let user = localStorage.getItem('user-auth');
        let userId = user && JSON.parse(user).id;
  
        // Prepare cart data to be sent to the server
        let cartData: cart = {
          ...this.productData,
          productId: this.productData.id,
          userId,
        };
        delete cartData.id;
  
        // Add the product to the remote cart via API call
        this.productService.addToCart(cartData).subscribe((result) => {
          if (result) {
            // After successfully adding the product to the remote cart
            // Fetch the updated cart list
            this.productService.getCartList(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }
  

removeToCart(productId: number) {
  // Check if the user is not logged in
  if (!localStorage.getItem('user-auth')) {
    // If not logged in, remove the item from the local cart
    this.productService.removeItemFromCart(productId);
  } else {
    // If logged in
    // Check if there is cart data available
    console.warn('cartData', this.cartData);
    let user = localStorage.getItem('user-auth');
    let userId = user && JSON.parse(user).id;
    this.cartData && 
      // Remove the item from the remote cart via API call
      this.productService.removeToCart(this.cartData.id).subscribe((result) => {
        // After successful removal, fetch the updated cart list
       if(result){
        this.productService.getCartList(userId);
       }
      });
      // Set removeCart flag to false
  this.removeCart = false;
  }
  
}

}
