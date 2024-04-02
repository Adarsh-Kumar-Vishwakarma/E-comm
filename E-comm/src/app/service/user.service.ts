import { EventEmitter, Injectable } from '@angular/core';
import { Login, SignUp } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000';

  invalidUserAuth= new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(user: SignUp) {
    this.http
      .post(`${this.baseUrl}/user`, user, { 
        observe: 'response',
     })
      .subscribe((result) => {
        console.log(result);
          localStorage.setItem('user-auth', JSON.stringify(result.body));
          this.router.navigateByUrl('/');
      });
  }

  

  userLogin(user: Login) {
    this.http
      .get<SignUp[]>(
        `${this.baseUrl}/user?email=${user.email}&password=${user.password}`,
        { observe: 'response' }
      )
      .subscribe((result) => {
        if (result && result.body?.length) {
          localStorage.setItem('user-auth', JSON.stringify(result.body[0]));
          this.router.navigateByUrl('/');
          this.invalidUserAuth.emit(false);
        }else{
          this.invalidUserAuth.emit(true);
        }
      });
  }
  
  // userAuthReload(){
  //   localStorage.getItem('user-auth');
  //   this.router.navigate(['/']);
  // }
}
