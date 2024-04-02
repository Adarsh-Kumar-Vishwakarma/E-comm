import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../service/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchResult: undefined | product[];

  constructor(
    private activatedroute: ActivatedRoute,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    let query = this.activatedroute.snapshot.paramMap.get('query');
    query &&
      this.productService.productList().subscribe({
        next:(res)=>{
          console.log(res)
        },
        error:(err)=>{
          console.log(err)
        }
      })
  }
}
