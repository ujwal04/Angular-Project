import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/_services/shared-data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild(LoginComponent) loginModal: LoginComponent;
  isLoggedOut:boolean = true;
  isLoggedIn:boolean = false;

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
  
  logout(){
    alert("you will be logged out");
    this.sharedDataService.LoggedOut(false);
    this.router.navigate(['/login']);
  }
  openLoginModal() {
    this.router.navigate(['/login']);
  }

}
