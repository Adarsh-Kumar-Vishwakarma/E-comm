import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit {

  productData: undefined | product;
  productMessage: undefined | string;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private route: Router) { }

  ngOnInit(): void {
    let productId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(productId);
    productId && this.productService.getProduct(productId).subscribe((result) => {
      console.log(result);
      this.productData = result;

    })

  }


  submit(data: product) {
    console.log(data);
    if (this.productData) {
      data.id = this.productData.id;

    }
    this.productService.updateProduct(data).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product details is successfully updated';
      }
      setTimeout(() => {
        this.route.navigateByUrl('/seller-home');
      }, 500);
    });
    setTimeout(() => { this.productMessage = undefined }, 1000);
  }

}
