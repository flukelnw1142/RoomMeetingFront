import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  private refreshSubject = new Subject<void>();

  private eventSubject = new Subject<{ emp_id_message: string;room_setting_dialog: boolean; room_add_dialog: boolean;add_booking_btn: boolean ;search_room: boolean  }>();
  event$ = this.eventSubject.asObservable();

  sendEvent(emp_id_message: string, room_setting_dialog: boolean, room_add_dialog: boolean, add_booking_btn: boolean, search_room: boolean) {
    this.eventSubject.next({emp_id_message,room_setting_dialog,room_add_dialog,add_booking_btn,search_room}); // ส่ง Event
  }
  



  private spinnerVisible = false;



  // แสดง SweetAlert
  showAlert(
    title: string,
    text: string,
    icon: 'success' | 'error' | 'warning' | 'info',
    confirmButtonText = 'OK'
  ): void {
    Swal.fire({
      position: 'top-end',
      title,
      text,
      icon,
      confirmButtonText,
    });
  }

  // แสดง Spinner
  showSpinner(): void {
    this.spinnerVisible = true;
    console.log('Spinner shown'); // Replace with actual spinner display logic
  }

  // ซ่อน Spinner
  hideSpinner(): void {
    this.spinnerVisible = false;
    console.log('Spinner hidden'); // Replace with actual spinner hide logic
  }

  // ตรวจสอบสถานะ Spinner
  isSpinnerVisible(): boolean {
    return this.spinnerVisible;
  }

  // แสดง Alert พร้อมจัดการ Spinner
  handleAlertWithSpinner(
    showSpinner: boolean,
    hideSpinner: boolean,
    title: string,
    text: string,
    icon: 'success' | 'error' | 'warning' | 'info',
    confirmButtonText = 'OK'
  ): void {
    if (showSpinner) this.showSpinner();

    this.showAlert(title, text, icon, confirmButtonText);

    if (hideSpinner) {
      setTimeout(() => {
        this.hideSpinner();
      }, 500); // Optional delay for smoother UX
    }
  }


  get refresh$() {
      return this.refreshSubject.asObservable();
  }

  triggerRefresh() {
      this.refreshSubject.next();
  }
}
