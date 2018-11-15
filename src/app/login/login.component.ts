import { Component, OnInit, Renderer2, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FBConfig, API, GoogleConfig } from '../app.constants';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../Services/user.service';
import { IUser } from '../models/user.model';

declare const FB: any;
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy
{
  public selectedTab: LoginTabs = LoginTabs.LogIn;
  public LoginTabs = LoginTabs;
  public loginForm: FormGroup;
  public signInForm: FormGroup;

  private fbScript: HTMLScriptElement;
  private googleScript: HTMLScriptElement;

  @ViewChild('googleLoginButton')
  public googleLoginButton: ElementRef;
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    private httpClient: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService) { }

  ngOnInit()
  {
    // FaceBook Login
    this.fbScript = this.renderer.createElement('script');
    this.fbScript.src =
      `https://connect.facebook.net/en_US/sdk.js#version=${FBConfig.version}&appId=${FBConfig.appId}&status=true&cookie=true&xfbml=false`;
    (this.elementRef.nativeElement as HTMLElement).appendChild(this.fbScript);

    // Google Login
    this.googleScript = this.renderer.createElement('script');
    this.googleScript.src = 'https://apis.google.com/js/platform.js';
    this.googleScript.async = true;
    this.googleScript.defer = true;
    (this.elementRef.nativeElement as HTMLElement).appendChild(this.googleScript);
    this.renderer.listen(this.googleScript, 'load', () =>
    {
      gapi.load('auth2', () =>
      {
        gapi.auth2.init({
          client_id: GoogleConfig.clientId,
          cookiepolicy: 'single_host_origin',
          scope: 'profile'
        }).attachClickHandler(
          this.googleLoginButton.nativeElement,
          {},
          googleUser =>
          {
            const authResponse = googleUser.getAuthResponse();

            this.httpClient.post(API.googleAuth, {
              id_token: authResponse.id_token
            }).subscribe((v: IUser) =>
            {
              this.userService.user = v;
              this.redirectToDashboard();
            });
          });
        (this.elementRef.nativeElement as HTMLElement).appendChild(this.googleScript);
      });
    });

    // Login Form
    this.loginForm = this.fb.group({
      username: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required)
    });

    // SignIn Form
    this.signInForm = this.fb.group({
      username: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
      confirmPassword: this.fb.control('', Validators.required)
    });
  }

  ngOnDestroy(): void
  {
    this.renderer.removeChild(this.elementRef.nativeElement, this.fbScript);
    this.renderer.removeChild(this.elementRef.nativeElement, this.googleScript);
  }

  public selectTab(tab: LoginTabs): void
  {
    if (this.selectedTab === tab) return;
    this.selectedTab = tab;
  }

  public FBLogin(): void
  {
    FB.login(response =>
    {
      if (response.authResponse)
      {
        console.log('Welcome!  Fetching your information.... ');
        this.httpClient.post(API.fbAuth, {
          access_token: response.authResponse.accessToken
        }).subscribe((v: IUser) =>
        {
          this.userService.user = v;
          this.redirectToDashboard();
        });
      } else
      {
        console.log('User cancelled login or did not fully authorize.');
      }
    });
  }

  public login()
  {
    if (this.loginForm.valid)
    {
      const values = this.loginForm.value;
      this.httpClient.post(API.login, {
        username: values.username,
        password: values.password
      }).subscribe((v: IUser) =>
      {
        this.userService.user = v;
        this.redirectToDashboard();
      });
    }
  }
  public signIn()
  {
    if (this.signInForm.valid)
    {
      const values = this.signInForm.value;
      if (values.password !== values.confirmPassword) return;
      this.httpClient.post(API.signIn, {
        username: values.username,
        password: values.password
      }).subscribe((v: IUser) =>
      {
        this.userService.user = v;
        this.redirectToDashboard();
      });
    }
  }

  private redirectToDashboard()
  {
    this.router.navigateByUrl('/dashboard');
  }
}
enum LoginTabs
{
  LogIn = 'LogIn',
  SignIn = 'SignIn'
}
