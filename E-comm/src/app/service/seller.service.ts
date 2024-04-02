import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login, SignUp } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter(false);

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(data: SignUp) {
    //  return this.http.post(`${this.Url}/seller`,data)
    this.http
      .post(`${this.baseUrl}/seller`, data, {
        observe: 'response',
      })
      .subscribe((result) => {
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller-auth', JSON.stringify(result.body));
        this.router.navigate(['seller-home']);
        console.log(result);
      });
  }

  reloadSeller() {
    if (localStorage.getItem('seller-auth')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  userLogin(data: Login) {
    console.log(data);
    this.http
      .get(`${this.baseUrl}/seller?email=${data.email}&&password=${data.password}`, {
        observe: 'response',
      })
      .subscribe((result: any) => {
        console.log(result);
        if (result && result.body && result.body.length) {
          localStorage.setItem('seller-auth', JSON.stringify(result.body));
          this.router.navigate(['seller-home']);
          // console.log('logged in');
        } else {
          this.isLoginError.emit(true);
          // console.log('Not logged in');
        }
      });
  }
}
