
import { CommonModule ,NgClass } from '@angular/common';
import { Component,EventEmitter,Output, HostListener, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuTrigger } from '@angular/material/menu';
import { LocalStorageService } from '../../services/login/local-storage.service';

import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UtilityService } from '../../services/utility.service';




@Component({
    selector: 'app-header',
    standalone: true,
    imports: [MatToolbarModule,MatFormFieldModule,MatSelectModule,MatInputModule,NgClass,FormsModule,MatCardModule,CommonModule, MatMenuModule,MatTooltipModule, MatButtonModule, RouterLink,MatIconModule, RouterLinkActive,MatMenuTrigger],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    animations: [
      trigger('transitionMessages', [
        state('void', style({ opacity: 0 })),
        state('visible', style({ opacity: 1 })),
        transition('void => visible', [animate('300ms ease-in')]),
        transition('visible => void', [animate('300ms ease-out')]),
      ])
    ]
})
export class HeaderComponent {

  roomForm: FormGroup;

    // Header Sticky
    isSticky: boolean = false;
    menuTrigger: any;
    empIdString: any;
    router = inject(Router);
    
    classApplied = false;
    @Output() messageEvent = new EventEmitter<string>();


    @HostListener('window:scroll', ['$event'])
    checkScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (scrollPosition >= 50) {
            this.isSticky = true;
        } else {
            this.isSticky = false;
        }
    }
     // isSidebarToggled
     isSidebarToggled = false;
     empId: any; 
     UserNameTh: any; 
     UserNameEn: any; 
     Department: any; 
     IsAdmin: boolean; 
     // isToggled
     isToggled = false;
 
     menuState: boolean = false; // กำหนดค่าเริ่มต้น

     constructor(private storage : LocalStorageService ,private utilityService : UtilityService){}
    
     SymbolName: string = '';
     ngOnInit(): void {
        this.empId  = localStorage.getItem('EmpId');
        this.UserNameTh  = localStorage.getItem('UserNameTh');
        this.UserNameEn  = localStorage.getItem('UserNameEn');
        this.Department  = localStorage.getItem('Department');
        this.IsAdmin  =localStorage.getItem('IsAdmin') === 'true'
        console.log('  this.IsAdmin :' + this.IsAdmin )
        this.SymbolName =   this.UserNameEn.split('.')[1].charAt(0);
        console.log("  Header empId :"  +this.empId )
        
        console.log("  Header UserNameTh :"  +this.UserNameTh )
        console.log("  Header UserNameEn :"  +this.UserNameEn )
        console.log("  Header Department :"  +this.Department )
        console.log("  Header IsAdmin :"  +this.IsAdmin )
        

     }
     openRoomSetting() {
      this.utilityService.sendEvent(this.empId,true ,false,false,false); // เปิด openRoomSetting ปิดปุ่ม add 
    }

    openAddRoom() {
      this.utilityService.sendEvent(this.empId,false ,true,false,false); // เปิด openRoomSetting ปิดปุ่ม add 
    }

    openSearchRoom() {
      this.utilityService.sendEvent(this.empId,false ,false,false,true); // เปิด openRoomSetting ปิดปุ่ม add 
    }
     logout(): void {
        localStorage.clear;
       
        console.log("  Header logout :"  + localStorage.getItem('UserNameTh') )


        this.storage.remove('UserNameTh');

        console.log("  Header logout after remove  :"  + localStorage.getItem('UserNameTh') )

        this.router.navigateByUrl('login');    
     }
    //  empId :string = localStorage.getItem('EmpId')
     // Burger Menu Toggle
    //  this.storage.set('auth-key', res.token);
    //  this.storage.set('EmpId', res.EmpId);
    //  this.storage.set('UserNameTh', res.UserNameTh);          
    //  this.storage.set('UserNameEn', res.UserNameEn);          
    //  this.storage.set('Department', res.Department);
    //  this.storage.set('IsAdmin', res.IsAdmin);
     
    // openMenu() {
    //     if (!this.menuState) {
    //       this.menuState = true;
    //       this.menuTrigger.openMenu(); // เรียกเปิดเมนูเฉพาะเมื่อยังไม่ได้เปิด
    //     }
    //   }
      
    //   closeMenu() {
    //     if (this.menuState) {
    //       this.menuState = false;
    //       this.menuTrigger.closeMenu(); // เรียกปิดเมนูหากยังเปิดอยู่
    //     }
    //   }
    //   toggleMenu = () => {
    //     this.menuState = !this.menuState; // `this` ชี้ไปที่ HeaderComponent
    //   };
}