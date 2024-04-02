import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent {
  addProductMessage: string | undefined;
  constructor(private productService: ProductService) {}
  submit(data: product) {
    console.log(data);
    this.productService.addProduct(data).subscribe((result) => {
      console.log(result);
      if(result){
        this.addProductMessage = 'Product is successfully added';
      }
      setTimeout(() => (this.addProductMessage = undefined),3000);
    });
  }
}
