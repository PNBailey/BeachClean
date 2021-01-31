import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  validationErrors: string[] = [];


  constructor(private route: Router, private accountService: AccountService, private formBuilder: FormBuilder ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  register() {
  
  this.accountService.register(this.registerForm.value).subscribe(() => {
  }, error => {
    this.validationErrors = error;
  }, () => {
    this.route.navigate(['../']);
  });
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      location: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.checkPasswordMatch('password')]],

    })
  }

  checkPasswordMatch(matchTo: any): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : {notMatching: true}
    }
  }


}
