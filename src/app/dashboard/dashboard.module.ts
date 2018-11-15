import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouteModule } from './dashboard.routing';
import { HttpClientModule } from '@angular/common/http';
import { SearchService } from '../Services/search.service';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRouteModule,
    HttpClientModule
  ],
  providers: [SearchService]
})
export class DashboardModule { }
