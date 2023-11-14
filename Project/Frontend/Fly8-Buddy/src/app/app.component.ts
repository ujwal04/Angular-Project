import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from './_services/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Fly8-Buddy';
  isLoggedIn:boolean;
  isLoggedOut:boolean;

  constructor(
    private sharedDataService:SharedDataService,
    private router:Router
  ){}


  ngOnInit(): void {
    this.sharedDataService.isLoggedIn$.subscribe(data => {
      this.isLoggedIn = data;
      this.isLoggedOut = !data;
    })
  }

}
