import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../shared/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};

  errorMessage: HttpErrorResponse;
  loginForm: FormGroup;

  constructor(private accountService: AccountService, private route: Router, private toastrService: ToastrService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  login() {
    this.accountService.login(this.loginForm.value).subscribe(() => {
    },  error => {
      this.toastrService.error(error.error);
    }, () => {
      this.route.navigate(['../']);
     
    });
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      
    })
  }


}
