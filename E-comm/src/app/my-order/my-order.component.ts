import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service';
import { order } from '../data-type';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css'],
})
export class MyOrderComponent implements OnInit {
  orderData: order[] | undefined;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getOrderList();
  }

  getOrderList() {
    this.productService.orderlist().subscribe((result) => {
      this.orderData = result;
    });
  }

  cancelOrder(orderId: number | undefined) {
    orderId &&
      this.productService.cancelOrder(orderId).subscribe((result) => {
        this.getOrderList();
      });
  }
}
