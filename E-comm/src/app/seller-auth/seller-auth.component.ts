import { Component, OnInit } from '@angular/core';
import { SellerService } from '../service/seller.service';
import { Router } from '@angular/router';
import { Login, SignUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent implements OnInit {
  constructor(private sellerService: SellerService, private route: Router) {}

  showLogin = true;
  authError: string = '';
  ngOnInit(): void {
    this.sellerService.reloadSeller();
  }

  signUp(data: SignUp): void {
    this.sellerService.userSignUp(data);
    // console.log(data);
    // this.sellerService.userSignUp(data).subscribe((res)=>{
    //   if(res){
    //     this.route.navigate(['seller-home'])
    //   }
    // });
  }

  
  login(data: Login): void {
    this.authError='';
    this.sellerService.userLogin(data);
    this.sellerService.isLoginError.subscribe((isError)=>{
      if(isError){
        this.authError="Email or password is not correct";
      }
    })
  }

  openSignUp() {
    this.showLogin = false;
  }

  openLogin() {
    this.showLogin = true;
  }
}
