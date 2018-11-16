import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../Services/user.service';
import { SearchService } from '../Services/search.service';

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
    private searchService: SearchService) { }

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
      if (!this.searchHistory.includes(term))
      {
        this.searchHistory.unshift(term);
        this.searchHistory = this.searchHistory.slice(0, 5);
      }
    });
  }

  public historySearch(term: string)
  {
    this.searchInput.nativeElement.value = term;
    this.search();
  }

  public logout()
  {
    this.userService.logout();
    window.location.href = window.location.origin;
  }
}
