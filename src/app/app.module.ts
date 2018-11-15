import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { CanActivateLogin } from './guards/can-activate-login.guard';
import { CanActiveDashboard } from './guards/can-activate-dashboard.guard';
import { UserService } from './Services/user.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [CanActivateLogin, CanActiveDashboard, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
