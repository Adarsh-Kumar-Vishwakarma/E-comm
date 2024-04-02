import { Component, OnInit } from '@angular/core';
import { Login, SignUp, cart, product } from '../data-type';
import { UserService } from '../service/user.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css'],
})
export class UserAuthComponent implements OnInit {
  showLogin = true;
  authError: string = '';

  constructor(
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // this.userService.userAuthReload();
  }

  signUp(data: SignUp) {
    this.userService.userSignUp(data);
    console.log(data);
  }

  login(data: Login) {
    this.userService.userLogin(data);
    console.log(data);
    this.userService.invalidUserAuth.subscribe((result) => {
      console.warn('Result= ', result);
      if (result) {
        this.authError = 'Please enter valid Login details';
      } else {
        this.localCartToRemoteCart();
      }
    });
  }

  openSignUp() {
    this.showLogin = false;
  }
  openLogin() {
    this.showLogin = true;
  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user-auth');
    let userId = user && JSON.parse(user).id;
    
    if (data) {
      let cartDataList: product[] = JSON.parse(data);
  
      cartDataList.forEach((product: product, index) => {
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId,
        };
        delete cartData.id;
  
        // Add a timeout to simulate asynchronous behavior
        setTimeout(() => {
          // Call the addToCart method of the productService to add the product to the remote cart
          this.productService.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn('data is stored in DB');
            }
          });
        }, 500);
  
        // Remove the localCart item after all products are added to the remote cart
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart');
        }
      });
    }
  
    // Fetch the updated cart list after a delay
    setTimeout(() => {
      this.productService.getCartList(userId);
    }, 2000);
  }
  
}
