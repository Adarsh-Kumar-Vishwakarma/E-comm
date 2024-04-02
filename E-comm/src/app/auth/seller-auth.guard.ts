import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SellerService } from '../service/seller.service';

@Injectable({
  providedIn: 'root'
})
export class SellerAuthGuard implements CanActivate {
  constructor(private sellerService: SellerService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('seller-auth')) {
        return true;
      }
    return this.sellerService.isSellerLoggedIn;
  }
  
}
