import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  popularProducts:undefined|product[];
  trendyProducts:undefined|product[];
  productData: undefined | product;
  productQuantity: number = 1

  constructor(private productService: ProductService, private router: Router){}

  ngOnInit(): void {
    this.productService.popularProducts().subscribe((data)=>{
      // console.log(data);
      this.popularProducts = data;
    });

    this.productService.trendyProducts().subscribe((data)=>{
      // console.log(data);
      this.trendyProducts = data;
    });
  
  }

  // addToCart(){
  //  if(this.productData){
  //   this.productData.quantity = this.productQuantity
  //   if(!localStorage.getItem('user-auth')){
  //     this.router.navigateByUrl('/user-auth');
    
  //   }else{
  //     this.productService.localAddToCart(this.productData);

  //   }
  //  }
  // }


}
