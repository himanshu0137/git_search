import { Injectable } from '@angular/core';
import { IUser } from '../models/user.model';

@Injectable()
export class UserService
{

  private _user: IUser;
  constructor() { }
  public get user(): IUser
  {
    if (!this._user)
    {
      const u = JSON.parse(sessionStorage.getItem('user')) as IUser;
      this._user = u;
    }

    return this._user;
  }
  public set user(u: IUser)
  {
    this._user = u;
    sessionStorage.setItem('user', JSON.stringify(u));
  }
  public logout()
  {
    sessionStorage.clear();
  }
}
