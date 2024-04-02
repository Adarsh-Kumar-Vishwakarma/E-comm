import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { product } from '../data-type';
import {
  faHome,
  faList,
  faSignInAlt,
  faSignOutAlt,
  faUserAlt,
  faPlusCircle,
  faShoppingCart,
  faReorder
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: undefined | product[];
  productMessage: string = '';
  cartItems = 0;

  iconHome = faHome;
  iconList = faList;
  iconLogin = faSignInAlt;
  iconLogout = faSignOutAlt;
  iconProfile = faUserAlt;
  iconAdd = faPlusCircle;
  iconCart = faShoppingCart;
  iconOrder = faReorder;


  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const sellerAuth = localStorage.getItem('seller-auth');
        const userAuth = localStorage.getItem('user-auth');

        if (event.url.includes('seller') && sellerAuth) {
          const sellerData = JSON.parse(sellerAuth)[0];
          if (sellerData && sellerData.name) {
            this.sellerName = sellerData.name;
          }
          this.menuType = 'seller';
        } else if (userAuth) {
          const userData = JSON.parse(userAuth)[0];
          if (userData && userData.name) {
            this.userName = userData.name;
          }
          this.menuType = 'user';
        } else {
          this.menuType = 'default';
        }
      }
    });

    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length;
    }
    this.productService.cartData.subscribe((items) => {
      this.cartItems = items.length;
    });
    
  }

  logout() {
    localStorage.removeItem('seller-auth');
    this.router.navigateByUrl('/');
  }

  userLogout() {
    localStorage.removeItem('user-auth');
    this.router.navigate(['/user-auth']);
    this.productService.cartData.emit([]);
  }

  // searchProduct(query:KeyboardEvent){
  //   if(query){
  //     const element = query.target as HTMLInputElement;
  //     this.productService.searchProducts(element.value).subscribe((result)=>{

  //       if(result.length>5){
  //         result.length=length
  //       }
  //       this.searchResult=result;
  //     })
  //   }
  // }

  // hideSearch(){
  //   this.searchResult=undefined
  // }
  // redirectToDetails(id:number){
  //   this.route.navigate(['/details/'+id])
  // }
  // submitSearch(val:string){
  //   console.warn(val)
  // this.route.navigate([`search/${val}`]);
  // }

  searchProducts(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.productService.productList().subscribe((result) => {
        let searchedVal = element.value;
        var searchResult = [];
        if (result) {
          for (let item of result) {
            if (item.name.toLowerCase().startsWith(searchedVal)) {
              searchResult.push(item);
            }
          }
        }
        this.searchResult = searchResult;
      });
    }
  }

  hideSearch() {
    this.searchResult = undefined;
  }

  submitSearch(val: string) {
    console.log(val);
    // this.router.navigate(['/search/'  + val]);
    this.router.navigate([`search/${val}`]);
  }

  redirectToDetails(id: number) {
    this.router.navigateByUrl('/details/' + id);
  }
}
