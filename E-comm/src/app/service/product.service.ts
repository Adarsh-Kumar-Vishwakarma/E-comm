import { HttpClient, JsonpInterceptor } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000';

  cartData = new EventEmitter<product[] | []>();

  constructor(private http: HttpClient) {}

  //   addProduct(data: product) {
  //     console.log('service called');
  //     return this.http.post('http://localhost:3000/products', data);
  //   }

  //   productList() {
  //     return this.http.get<product[]>('http://localhost:3000/products');
  //   }

  //   deleteProduct(id: number) {
  //     return this.http.delete(`http://localhost:3000/products/${id}`);
  //   }

  //   getProduct(id: string) {
  //     return this.http.get<product>(`http://localhost:3000/products/${id}`);
  //   }

  //   updateProduct(product: product) {
  //     return this.http.put<product>(`http://localhost:3000/products/${product.id}`, product);
  //   }

  //   popularProducts() {
  //     return this.http.get<product[]>('http://localhost:3000/products?_limit=5');
  //     //return this.http.get<product[]>('http://localhost:3000/products');
  //   }

  //   trendyProducts() {
  //     // return this.http.get<product[]>('http://localhost:3000/products?_limit=3');
  //     return this.http.get<product[]>('http://localhost:3000/products');
  //   }

  //   searchProducts(query: string) {
  //     return this.http.get<product[]>(`http://localhost:3000/products?q=${query}`);
  //   }

  addProduct(data: product): Observable<any> {
    return this.http.post(`${this.baseUrl}/products`, data).pipe(
      catchError((error) => {
        console.error('Error adding product:', error);
        return throwError(error);
      })
    );
  }

  productList(): Observable<product[]> {
    return this.http.get<product[]>(`${this.baseUrl}/products`).pipe(
      catchError((error) => {
        console.error('Error fetching product list:', error);
        return throwError(error);
      })
    );
  }

  deleteProduct(id: number): Observable<any> {
    const url = `${this.baseUrl}/products/${id}`;
    return this.http.delete(url).pipe(
      catchError((error) => {
        console.error(`Error deleting product with ID ${id}:`, error);
        return throwError(error);
      })
    );
  }

  getProduct(id: string): Observable<product> {
    const url = `${this.baseUrl}/products/${id}`;
    return this.http.get<product>(url).pipe(
      catchError((error) => {
        console.error(`Error fetching product with ID ${id}:`, error);
        return throwError(error);
      })
    );
  }

  updateProduct(product: product): Observable<product> {
    const url = `${this.baseUrl}/products/${product.id}`;
    return this.http.put<product>(url, product).pipe(
      catchError((error) => {
        console.error(`Error updating product with ID ${product.id}:`, error);
        return throwError(error);
      })
    );
  }

  popularProducts(): Observable<product[]> {
    // const url = `${this.baseUrl}?_limit=5`;
    const url = `${this.baseUrl}/products`;
    return this.http.get<product[]>(url).pipe(
      catchError((error) => {
        console.error('Error fetching popular products:', error);
        return throwError(error);
      })
    );
  }

  trendyProducts(): Observable<product[]> {
    return this.http.get<product[]>(`${this.baseUrl}/products`).pipe(
      catchError((error) => {
        console.error('Error fetching trendy products:', error);
        return throwError(error);
      })
    );
  }

  // searchProduct(query: string): Observable<product[]> {
  //   const url = `${this.baseUrl}/products?q=${query}`;
  //   return this.http.get<product[]>(url).pipe(
  //     catchError((error) => {
  //       console.error(`Error searching products with query "${query}":`, error);
  //       return throwError(error);
  //     })
  //   );
  // }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((items: product) => productId !== items.id);
      console.warn('not available = ', items);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post(`${this.baseUrl}/cart`, cartData);
  }
  // addToCart(cartData: cart) {
  //   return this.http.post('http://localhost:3000/cart', cartData);
  // }

  getCartList(userId: cart) {
    return this.http
      .get<product[]>(`${this.baseUrl}/cart?userId=` + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        console.log(result);
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  removeToCart(cartId: number) {
    return this.http.delete(`${this.baseUrl}/cart/` + cartId);
  }

  currentCart() {
    let userStore = localStorage.getItem('user-auth');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>(`${this.baseUrl}/cart?userId=` + userData.id);
  }

  orderNow(data: order) {
    return this.http.post(`${this.baseUrl}/orders`, data).pipe(
      catchError((error) => {
        console.error('Error adding order:', error);
        return throwError(error);
      })
    );
  }

  orderlist() {
    let userStore = localStorage.getItem('user-auth');
    let userData = userStore && JSON.parse(userStore);
    return this.http
      .get<order[]>(`${this.baseUrl}/orders?userId=` + userData.id)
      .pipe(
        catchError((error) => {
          console.error(`Error fetching order with ID :` + userData.id, error);
          return throwError(error);
        })
      );
  }

  deleteCartItems(cartId: number) {
    return this.http
      .delete(`${this.baseUrl}/cart/` + cartId, { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          this.cartData.emit([]);
        }
      });
  }

  cancelOrder(orderId:number){
    return this.http.delete(`${this.baseUrl}/orders/` + orderId);
  }
}
