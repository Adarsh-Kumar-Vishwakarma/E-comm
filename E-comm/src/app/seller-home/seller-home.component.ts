import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { product } from '../data-type';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[];
  productMessage: undefined | string;
  iconDelete = faTrash;
  iconEdit = faEdit;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.list();
  }
  list() {
    this.productService.productList().subscribe((result) => {
      console.log(result);
      this.productList = result;
      console.log(this.productList);
    });
  }

  deleteProduct(id: number) {
    console.log('test id', id);
    this.productService.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product deleted successfully';
        this.list();
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }

 
}
