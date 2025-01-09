
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';

// bootstrapApplication(AppComponent, {
//     providers: [
//       importProvidersFrom(BrowserAnimationsModule) // เพิ่มที่นี่
//     ]
//   },appConfig);
  
bootstrapApplication(AppComponent, appConfig)
    .catch((err) => console.error(err));



// bootstrapApplication(AppComponent, {
//     providers: [
//       provideAnimations(), // เพิ่มการรองรับ Animation
//       provideNativeDateAdapter() 
//     ]
//   }).catch(err => console.error(err));

    