import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../Services/user.service';
import { SearchService } from '../Services/search.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit
{

  @ViewChild('searchInput')
  public searchInput: ElementRef;

  public searchHistory: Array<string> = [];
  public searchResult: Array<any> = [];
  public userName: string;
  constructor(
    private userService: UserService,
    private searchService: SearchService,
    private router: Router) { }

  ngOnInit()
  {
    this.searchService.getSearchHistory().subscribe(v =>
    {
      this.searchHistory = !!v ? v : [];
    });
    this.userName = this.userService.user.firstName;
    if (this.userService.user.lastName)
    {
      this.userName += (' ' + this.userService.user.lastName);
    }
  }

  public search()
  {
    const term: string = this.searchInput.nativeElement.value;
    this.searchService.search(term).subscribe(v =>
    {
      this.searchResult = v;
      this.searchHistory.unshift(term);
      this.searchHistory = this.searchHistory.slice(0, 5);
    });
  }

  public logout()
  {
    this.userService.logout();
    window.location.href = window.location.origin;
  }
}
