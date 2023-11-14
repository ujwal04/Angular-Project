import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/_services/shared-data.service';
import { UserDataService } from 'src/app/_services/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  isModalOpen = false;
  email: string = '';    // Variable to store the email value
  password: string = '';


  constructor(
    private router:Router,
    private userDataService:UserDataService,
    private sharedDataService:SharedDataService,

  ) { }

  ngOnInit(): void {
    // Modal is initially closed
    this.isModalOpen = true;
  }

  openModal() {
    // Set the variable to true to open the modal
    this.isModalOpen = true;
  }

  closeModal() {
    // Set the variable to false to close the modal
    this.isModalOpen = false;
    this.router.navigate(['/home']);
  }

  RegisterationForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });

  get f(){
    return this.RegisterationForm.controls;
  }

  onSubmit(){
    this.userDataService.checkLogin({email:this.email,password:this.password}).subscribe({
      next:(response:any)=>{
        if(response.token){
          alert(response.message);
          this.sharedDataService.LoggedIn(true);
          this.userDataService.setToken(response.token);
          this.router.navigate(['/flight'])
        }
      }
    });
  }

}
