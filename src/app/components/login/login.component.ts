import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router,RouterLink } from '@angular/router';
import { IntegrationService } from '../../services/login/intrgration.service';
import { LocalStorageService } from '../../services/login/local-storage.service';
import { LoginRequest } from '../../model/login';
import { MatCardModule } from '@angular/material/card';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

import { UtilityService } from '../../services/utility.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [MatCardModule,NgxSpinnerModule,MatProgressBarModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

  animal: string;
  name: string;
  authForm: FormGroup;

    constructor(private fb: FormBuilder, private  utilityService: UtilityService,private integration: IntegrationService,private storage : LocalStorageService,public dialog: MatDialog ,private spinner: NgxSpinnerService)
     {
        this.authForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]],});       
    }
    
    // Password Hide
    hide = true;
    router = inject(Router);
    isLoading = true;
    // request: LoginRequest;



    ngOnInit() {
        /** spinner starts on init */
       
    
        // setTimeout(() => {
        //   /** spinner ends after 5 seconds */
        //   this.spinner.hide();
        // }, 5000);
      }


    onSubmit() {
      if (this.authForm.valid) {
        this.spinner.show();
          const loginRequest: LoginRequest = {
              Username: this.authForm.get('email')?.value,
              Password: this.authForm.get('password')?.value
          };
  
          this.integration.doLogin(loginRequest).subscribe({
              next: (res) => {
                  this.storage.set('auth-key', res.token);
                  this.storage.set('EmpId', res.empId);
                  this.storage.set('UserNameTh', res.userNameTh);
                  this.storage.set('UserNameEn', res.userNameEn);
                  this.storage.set('Department', res.department);
                  this.storage.set('IsAdmin', res.isAdmin);
                  this.spinner.hide();
                  this.router.navigateByUrl('new-dashboard');
              
              },
              error: (err) => {
                  console.error("Error Received Response:", err);
  
                  this.isLoading = false;
                  this.storage.remove('auth-key');
            
  
                  let errorMessage = "An unexpected error occurred.";
                  if (err?.error?.message) {
                      errorMessage = err.error.message;
                  }
                  this.spinner.hide();
                  this.utilityService.showAlert( 'Error!',  errorMessage, 'error');
              }
          });
  
      } else {
          console.warn('Form is invalid. Please check the fields.');
     
      }
  

  }
  
  

    openModal()
    {

  
  
    }


}

