import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../Services/user.service';

@Injectable()
export class CanActivateLogin implements CanActivate
{
  constructor(private userService: UserService, private router: Router) { }
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
  {
    if (!this.userService.user)
    {
      return true;
    }
    this.router.navigateByUrl('dashboard');

    return false;
  }
}
