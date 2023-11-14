import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/_models/user.model';
import { UserDataService } from 'src/app/_services/user-data.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  user!:User;

  constructor(
    private router:Router,
    private userDataService:UserDataService,
  ) { }

  RegisterationForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(2)]),
    address1: new FormControl('', [Validators.required, Validators.minLength(6)]),
    address2: new FormControl('', [Validators.required, Validators.minLength(1)]),
    city: new FormControl('', [Validators.required, Validators.minLength(1)]),
    state: new FormControl('', [Validators.required, Validators.minLength(1)]),
    zip: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  get f(){
    return this.RegisterationForm.controls;
  }

  submit() {
    if (this.RegisterationForm.valid) {

      console.table(this.RegisterationForm.value);
      const { firstName, lastName, email, password, address1, address2, city, state, zip } = this.RegisterationForm.value;
      // Create a new User instance
      const userToAdd = new User(firstName, lastName, email, password, address1, address2, city, state, zip);
      this.userDataService.createNewUser(userToAdd)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.router.navigate(['/login']);
          },
          error: (err: any) => alert(err)
        })
    }


  }

}
