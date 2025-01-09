import { Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction'; // สำหรับการคลิกอีเวนต์

import { FullCalendarModule } from '@fullcalendar/angular';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../../common/header/header.component';
import { AddNewComponent } from '../../common/add-new/add-new.component';
import { RoomService } from '../../services/room/room.service';
import { CommonModule } from '@angular/common';
import {
    MatDatepickerInputEvent,
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { booking, bookingDetail, defaultBookingDetail, GroupedBookings, SearchRoomRequest, selectedImages, tFile } from '../../model/dashboard';
import Swal from 'sweetalert2';
import { RoomComponent } from '../room/room.component';
import { UtilityService } from '../../services/utility.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Console } from 'console';
import moment from 'moment';

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import timeGridPlugin from '@fullcalendar/timegrid'; // Plugin สำหรับ timeGrid

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [
        MatTableModule,
        MatPaginator,
        MatPaginatorModule,
        NgxSpinnerModule,
        ReactiveFormsModule,
        CarouselModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatCardModule,
        CommonModule,
        FullCalendarModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        HeaderComponent,
        NgxMaterialTimepickerModule,
        RoomComponent,
    ],
    templateUrl:  './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
    todaysCourseSlides: OwlOptions = {
        items: 1,
        nav: false,
        margin: 25,
        loop: true,
        dots: true,
        autoplay: true,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        autoplayHoverPause: true,
    };
    roomSelected: { id: string; name: string; Seats: string; Facilities: string; img: tFile[] } | null;
    roomData : RoomElement[] = [];
    roomDataSource = new MatTableDataSource<RoomElement>(this.roomData);
  
    roomSelectedId:string;
    roomOption: { id: string; name: string;Seats :string ;Facilities:string; img :tFile []}[];

    selected: Date | null;
    today = new Date();
    bookingForm: FormGroup;
    searchRoomForm : FormGroup;
    bookingEditForm: FormGroup;
    todayBookings: any;
    images: {
        url: string;
        title: string;
        Seats: number;
        Facilities: string;
    }[] = [];
    isInputDetailDisabled = true; 
  
    bookingDetail: bookingDetail = { ...defaultBookingDetail };
    add_btn_disabled: boolean = false;
    RoomElementData: RoomAvailable[] = [];
        @ViewChild(MatPaginator) paginator!: MatPaginator;
        @ViewChild(MatSort) sort!: MatSort;
    
    dataSource = new MatTableDataSource<RoomAvailable>(this.RoomElementData);
    displayedColumns: string[] = [
      
          'roomImg',
          'roomDetail',         
          'action'
      ];

      showHeader = false;
    classApplied = false;
    classRoomdDetailApplied = false;
    RoomSearchClassApplied= false ;
    selectedTopic: any;
    bookingFromTime: string = ''; // เวลาที่เลือกในฟิลด์ "From"
    bookingToTime: string = ''; // เวลาที่เลือกในฟิลด์ "To"
    message: string = '';
    todayEvenError: string = '';
    topics = [
        { name: 'Internal' },
        { name: 'External' },
        { name: 'Executives' },
    ];
    monthlyEvent: {
        bookingNo: string;
        title: string;
        date: string;
        extendedProps: {
            bookingNo: string;
            description: string;
        };
    }[] = [];
    imageSlides: OwlOptions = {
        items: 1,
        nav: false,
        loop: true,
        margin: 25,
        dots: true,
        autoplay: true,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        navText: [
            "<i class='flaticon-chevron-1'></i>",
            "<i class='flaticon-chevron'></i>",
        ],
    };

    getOptionClass(category: string): string {
        console.log('category :', category);
        switch (category) {
            case 'frontend':
                return 'frontend-option';
            case 'backend':
                return 'backend-option';
            case 'database':
                return 'database-option';
            default:
                return '';
        }
    }

    availableTimesFrom: string[] = [];
    minDate: Date;
    availableTimesTo: string[] = [];
    empId : string = '';
    selectedTimeFrom: string = ''; // Default value
    selectedTimeTo: string = '';

    selectedTimeFromEdit: string = ''; // Default value
    selectedTimeToEdit: string = ''; // Default value
 

    errorMessage: string = '';

    selectedTime: string = ''; // เก็บค่าที่เลือก
    timeRangErrorMessage: string = '';
    constructor(
        private fb: FormBuilder,
        private roomService: RoomService,
        private utilityService: UtilityService,
        private spinner: NgxSpinnerService,
    ) {
        
        this.minDate = new Date();
    }

    ngOnInit(): void {
        this.utilityService.refresh$.subscribe(() => {
            console.log('Refreshing data in Room Component');
            this.loadOptions(); // เมธอดโหลดข้อมูลใหม่
        });
        this.utilityService.event$.subscribe((data) => {
            this.empId = data.emp_id_message;
            this.RoomSearchClassApplied = data.search_room;
            this.classApplied = data.add_booking_btn;
            // console.log('subscribe :' + this.empId);
            // this.switchMode('add');           
        });
        // this.utilityService.event$.subscribe((data) => {
        //     this.message = data.emp_id_message; // รับข้อความจาก Shared Service
        //     this.add_btn_disabled = data.add_booking_btn;
        //     console.log('ngOnInit add_btn_disabled : ', this.add_btn_disabled);
        // });
        this.loadOptions();
        this.searchRoomForm = this.fb.group({
            searchDate : ['', [Validators.required]],
            searchTimeFrom : ['', [Validators.required]],
            searchTimeTo : ['', [Validators.required]],
        });
        this.bookingForm = this.fb.group({
            BookingRoomId: ['', [Validators.required]],
            BookingDate: ['', [Validators.required]],
            BookingType: ['', [Validators.required]],
            BookingTimeFrom: ['', [Validators.required]],
            BookingTimeTo: ['', [Validators.required]],
            BookingTopic: ['', [Validators.required]],
            Description: ['', [Validators.required]],
            Phone: [
                '',
                [
                  Validators.required,
                  Validators.pattern(/^\d{4}$|^\d{10}$/) // ตัวเลข 4 ตัว หรือ 10 ตัว
                ]
              ]
        });
        this.bookingEditForm = this.fb.group({
            BookingRoomId: ['', [Validators.required]],
            BookingDate: ['', [Validators.required]],
            BookingType: ['', [Validators.required]],
            BookingTimeFrom: ['', [Validators.required]],
            BookingTimeTo: ['', [Validators.required]],
            BookingTopic: ['', [Validators.required]],
            Description: ['', [Validators.required]],
            Phone: [
                '',
                [
                  Validators.required,
                  Validators.pattern(/^\d{4}$|^\d{10}$/) // ตัวเลข 4 ตัว หรือ 10 ตัว
                ]
              ]
        });
    }

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        dayMaxEvents: true,
        events: this.monthlyEvent,
        plugins: [dayGridPlugin, timeGridPlugin], // เพิ่มทั้ง dayGrid และ timeGrid Plugins
        headerToolbar: {
            left: 'prev,next today', // ปุ่มเลื่อนเดือนหรือวัน
            center: 'title', // ตำแหน่งชื่อปฏิทิน
            right: 'dayGridMonth,timeGridWeek,timeGridDay', // ปุ่มเปลี่ยนมุมมอง
          },
          views: {
            dayGridMonth: { buttonText: 'Month' },
            timeGridWeek: { buttonText: 'Week' },
            timeGridDay: { buttonText: 'Day' },
          },
        eventContent: function (arg) {
            let title = arg.event.title;
            const eventType = arg.event.extendedProps['type'];
            var typColour = '';
            // if(eventType == 'External')
            //     typColour='#ccb7e5'
            // else if(eventType == 'Internal')
            //     typColour='#ffb3c6'
            // else if(eventType == 'Executives')
            //     typColour='#afd5f0'

            // ตรวจสอบข้อความและจัดรูปแบบ
            if (title.length > 18) {
                return {
                    html: `<div class="fc-event-title" style="background-color:${typColour} ;">${title}</div>`,
                };
                // title = title.substring(0, 33) + '...'; // ตัดข้อความเกิน 36 ตัวอักษร
            } else {
                return {
                    html: `<div class="fc-event-title" style="background-color:${typColour} ;">${title}</div>`,
                };
            }
        },
        eventClick: this.handleEventClick.bind(this),
        eventDidMount: (info) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = info.event.extendedProps['description'];
            info.el.setAttribute('title', tooltip.innerHTML);
        },
        // eventClassNames: (arg) => {
        //     const eventType = arg.event.extendedProps['type'];
        //     switch (eventType) {
        //         case 'External':
        //             return ['event-External'];
        //         case 'Internal':
        //             return ['event-Internal'];
        //         default:
        //             return ['event-Executives'];
        //     }
        // },
    };
    onKeyup(event: KeyboardEvent): void {
        const input = (event.target as HTMLInputElement).value;
        console.log('User input:', input);
    }


    // calendarOptions: CalendarOptions = {
    //     events: [
    //       { title: 'Info Event', start: '2024-12-01', extendedProps: { type: 'info' } },
    //       { title: 'Success Event', start: '2024-12-02', extendedProps: { type: 'success' } },
    //       { title: 'Danger Event', start: '2024-12-03', extendedProps: { type: 'danger' } },
    //     ],
    //     eventClassNames: (arg) => {
    //       const eventType = arg.event.extendedProps['type'];
    //       switch (eventType) {
    //         case 'info':
    //           return ['event-info'];
    //         case 'success':
    //           return ['event-success'];
    //         case 'danger':
    //           return ['event-danger'];
    //         default:
    //           return ['event-default'];
    //       }
    //     }
    //   };

    handleEventClick(arg: any): void {
        this.toggleRoomdDetailClass();
        const bookingNo = arg.event.extendedProps['bookingNo'];
        this.loadDetailRoom(bookingNo);
        console.log('Event clicked:', arg.event);
        // .ใส่ margin pop hover
        const popoverElements = document.querySelectorAll('.fc-popover');
        popoverElements.forEach((popover) => {
            (popover as HTMLElement).style.top = '186px'; // ปิด popover
            (popover as HTMLElement).style.left = '450px'; // ปิด popover
        });
    }

    initializeTimesFrom(selectedDate: Date): void {
        const selectedTime = new Date(selectedDate); // แปลง selectedDate ให้เป็น Date object
        const currentTime = new Date(); // วันที่และเวลาปัจจุบัน
        const selectedDay = selectedTime.toDateString();
        const currentDay = currentTime.toDateString();
        // ตรวจสอบว่า selectedDate เป็นวันนี้หรือไม่
        const isToday = selectedDay === currentDay;
        const startHour = isToday ? currentTime.getHours() : 0; // ถ้าเป็นวันนี้ เริ่มที่ชั่วโมงปัจจุบัน
        const startMinute = isToday ? currentTime.getMinutes() : 0;
        this.availableTimesFrom = []; // ล้างค่าที่มีอยู่ก่อน
        // สร้างช่วงเวลา
        for (let hour = startHour; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                if (
                    hour > startHour ||
                    (hour === startHour && minute > startMinute) ||
                    !isToday
                ) {
                    this.availableTimesFrom.push(
                        `${hour.toString().padStart(2, '0')}:${minute
                            .toString()
                            //.padStart(2, '0')} น.`
                            .padStart(2, '0')}`
                    );
                }
            }
        }
        // ตั้งค่าค่าที่เลือกเริ่มต้น
        this.selectedTimeFrom = this.availableTimesFrom[0] || ''; // Default value
        this.availableTimesTo = [...this.availableTimesFrom];
        console.log('this.selectedTimeFrom' + this.selectedTimeFrom);
        // this.selectedTimeTo = this.availableTimes[1] || '';
    }

    loadDetailRoom(bookingNo: string): void {
        this.roomService.getBookingsRoomDetail(bookingNo).subscribe({
            next: (res) => {
                // Execute

                if (!res.success) {
                    // this.todayEvenError = res.message;
                } else {                    
                    const booking = res.data;

                    // ตัวอย่างการใช้งานข้อมูลที่ได้
                    this.bookingDetail = {
                        bookingNo: booking.bookingNo || '',
                        roomId: booking.roomId || '',
                        roomName: booking.roomName || '',
                        roomLocation: booking.roomLocation || null,
                        roomFloor: booking.roomFloor || null,
                        description: booking.description || '',
                        bookingDate:booking.bookingDate || '',
                        bookingFrom: booking.bookingFrom || null,
                        bookingTo: booking.bookingTo || null,
                        bookingType: booking.bookingType || null,
                        bookingSubject: booking.bookingSubject || null,
                        bookingByContact: booking.bookingByContact || null,
                        bookingBy: booking.bookingBy || null,
                        bookingByName: booking.bookingByName || null,
                        bookingByMobile: booking.bookingByMobile || null,
                        bookingDepartment: booking.bookingDepartment || null,
                        isOwner: booking.isOwner || false,
                    };
                  
                    this.bookingEditForm = this.fb.group({
                        BookingRoomId: [   this.bookingDetail.roomId, [Validators.required]],
                        BookingDate: ['', [Validators.required]],
                        BookingType: [  this.bookingDetail.bookingType, [Validators.required]],
                        BookingTimeFrom: [ this.bookingDetail.bookingFrom, [Validators.required]],
                        BookingTimeTo: [ this.bookingDetail.bookingTo, [Validators.required]],
                        BookingTopic: [  this.bookingDetail.bookingSubject, [Validators.required]],
                        Description: [ this.bookingDetail.description, [Validators.required]],
                        Phone: [this.bookingDetail.bookingByMobile, [Validators.required]],
                    });

                    this.bookingEditForm.get('BookingDate')?.setValue(new Date( this.bookingDetail.bookingDate)); 
                   this.selectedTimeFromEdit = this.bookingDetail.bookingFrom ?? "";
                   this.selectedTimeToEdit = this.bookingDetail.bookingTo ?? "";
                   this.initializeTimesFrom(new Date( this.bookingDetail.bookingDate));

                }
                console.log('  this.monthlyEvent :', this.monthlyEvent);
            },
            error: (error) => {
                console.error('Error monthlyEvent:', error);
            },
        });
    }

    onTimeFromChange(selectedTime: string): void {
        this.selectedTimeFrom = selectedTime;
       
        const selectedMinutes = this.timeStringToMinutes(selectedTime);
    
        this.availableTimesTo = this.availableTimesFrom.filter((time) => {
            const timeMinutes = this.timeStringToMinutes(time);
    
            return timeMinutes > selectedMinutes || timeMinutes < selectedMinutes;
        });
    
        if (
            this.selectedTimeTo &&
            !this.isTimeValidForSelectedFrom(this.selectedTimeTo, selectedMinutes)
        ) {
            this.selectedTimeTo = '';
        }
    }
    
    private isTimeValidForSelectedFrom(selectedTimeTo: string, selectedMinutesFrom: number): boolean {
        const selectedMinutesTo = this.timeStringToMinutes(selectedTimeTo);
    
        return selectedMinutesTo > selectedMinutesFrom || selectedMinutesTo < selectedMinutesFrom;
    }

    // Utility function to convert time string to minutes
    private timeStringToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    onSearchDateSelected(event: MatDatepickerInputEvent<Date>): void {
        const selectedDate = event.value; // รับค่าวันที่ที่เลือก (Date | null)
        if (selectedDate) {
            // const isToday = moment(selectedDate, 'YYYY-MM-DD').isSame(
            //     moment(),
            //     'day'
            // );
            // if (isToday) {
            //     this.initializeTimes(selectedDate);
            // } else {
            this.initializeTimesFrom(selectedDate);
            // }
        } else {
            console.log('No date selected');
        }
    }
    onAddbookingDateSelected(event: MatDatepickerInputEvent<Date>): void {
        const selectedDate = event.value; // รับค่าวันที่ที่เลือก (Date | null)
        console.log('onAddbookingDateSelected :',selectedDate);
        if (selectedDate) {
            // const isToday = moment(selectedDate, 'YYYY-MM-DD').isSame(
            //     moment(),
            //     'day'
            // );
            // if (isToday) {
            //     this.initializeTimes(selectedDate);
            // } else {
            this.initializeTimesFrom(selectedDate);
            // }
        } else {
            console.log('No date selected');
        }
    }

    compareDateWithMoment(selectedDate: string): boolean {
        const today = moment(); // วันที่ปัจจุบัน
        const selected = moment(selectedDate, 'YYYY-MM-DD'); // วันที่ที่เลือก

        // ตรวจสอบว่า selected มากกว่า today หรือไม่
        return today == selected;
    }

    
    loadOptions(): void {
        this.roomService.getOptions("active").subscribe({
            next: (data) => {
                this.roomOption = data.map((item) => ({
                    id: String(item.id),
                    name: item.roomName + ' Floor ' + item.roomFloor,
                    Seats :item.seatCount,
                    Facilities:item.facilities,
                    img  : item.files|| []
                }));
                if (this.roomOption.length > 0) {
                    this.roomSelected = this.roomOption[0];
                    this.loadTodayBookiog(Number(this.roomSelected.id));
                    this.loadAllBookiogByRoom(Number(this.roomSelected.id));
                    this.roomSelectedId =      this.roomSelected.id;

                } else {
                    this.roomSelected = null; // หรือค่าเริ่มต้นตามที่คุณต้องการ
                }

               
                
                console.log('load data options:', data );
                console.log('load ROOM options:',  this.roomOption );
            },
            error: (error) => {
                console.error('Error loading options:', error);
            },
        });
    }
    loadTodayBookiog(roomId: number): void {
        this.todayEvenError = '';
        this.todayBookings = null;
        this.roomService.getTodayBookings(roomId).subscribe({
            next: (res) => {
                // Execute

                if (!res.success) {
                    this.todayEvenError = res.message;
                } else {
                    this.todayBookings = res.data;
                }
                console.log('todayBookings :', this.todayBookings);
            },
            error: (error) => {
                console.error('Error loading options:', error);
            },
        });
    }

    loadAllBookiogByRoom(roomId: number): void {
        this.todayEvenError = '';
        this.todayBookings = null;
        this.roomService.getAllBookingsByRoom(roomId).subscribe({
            next: (res) => {
                if (!res.success) {
                    this.todayEvenError = res.message;
                    this.monthlyEvent = [];
                } else {
                    this.monthlyEvent = res.data.map((item) => ({
                        bookingNo: item.bookingNo,
                        title: item.title,
                        date: item.date,
                        extendedProps: {
                            bookingNo: item.bookingNo,
                            description: item.description,
                            type: item.bookingType,
                        },
                    }));
                }
                this.calendarOptions = {
                    ...this.calendarOptions, // คัดลอกค่าที่มีอยู่
                    events: this.monthlyEvent, // แทนที่ events ด้วยข้อมูลใหม่
                };
                console.log(' this.monthlyEvent :', this.monthlyEvent);
            },
            error: (error) => {
                console.error('Error monthlyEvent:', error);
            },
        });
    }

    getImageSrc(image: {id: number;
        roomId: number;
        fileType: string;
        filePath: string; 
        fileName: string; 
        labelText?: string; 
        uploadedDate: Date;
        uploadedBy?: string;  }): string {
        //console.log('getImageSrc :'+`${image.filePath}/${image.fileName}`)
        return `${image.fileName}`;
    }
    onCategoryChange(roomId: number): void {
        this.roomSelected  = this.roomOption.find(room => room.id === roomId.toString())|| null;
        this.loadTodayBookiog(roomId);
        this.loadAllBookiogByRoom(roomId);
      //  console.log('roomId :', this.selectedImages);
    }

    onbookingSubmit() {
        if (this.bookingForm.valid) {
            this.spinner.show();

            const bookingRequest: booking = {
                RoomId: this.bookingForm.get('BookingRoomId')?.value,
                BookingNo: '',
                BookingDate: this.bookingForm.get('BookingDate')?.value,
                BookingFrom: this.bookingForm.get('BookingTimeFrom')?.value,
                BookingTo: this.bookingForm.get('BookingTimeTo')?.value,
                BookingBy: '',
                BookingByName: '',
                BookingByContact: this.bookingForm.get('Phone')?.value,
                BookingType: this.bookingForm.get('BookingType')?.value,
                BookingSubject: this.bookingForm.get('BookingTopic')?.value,
                BookingDetail: this.bookingForm.get('Description')?.value,
                BookingByEmail: '',
                BookingAttendees: '',
                Remark: '',
                CancelBy: '',
                CancelDate: '',
                CreatedBy: '',
                CreatedDate: '',
                ModifiedBy: '',
                ModifiedDate: '',
                BookingStatus: 'Reserved',
            };

            this.roomService.addBookingRoom(bookingRequest).subscribe({
                next: (res) => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Booking has been saved',
                        showConfirmButton: false,
                        timer: 2500,
                    });
                    this.spinner.hide();
                    this.onCategoryChange(res.data);
                    // this.ngOnInit();
                    this.toggleClass();
                },
                error: (err) => {
                    console.error('Error Received Response: ', err);

                    let errorMessage =
                        'An unexpected error occurred. Please try again later.';

                    // ตรวจสอบข้อผิดพลาดที่ส่งกลับจาก API
                    if (err.error && err.error.message) {
                        errorMessage = err.error.message;
                    } else if (err.status === 0) {
                        // กรณี API ไม่ตอบสนอง (Network error)
                        errorMessage =
                            'Unable to connect to the server. Please check your internet connection.';
                    } else if (err.status === 400) {
                        // กรณีข้อมูลไม่ถูกต้อง
                        errorMessage =
                            'Invalid input. Please check your data and try again.';
                    } else if (err.status === 409) {
                        // กรณี Conflict เช่น ห้องไม่ว่าง
                        errorMessage =
                            'The room is already booked during the selected time.';
                    } else if (err.status >= 500) {
                        // กรณีเซิร์ฟเวอร์เกิดข้อผิดพลาด
                        errorMessage =
                            'Server error occurred. Please contact support.';
                    }
                    this.spinner.hide();

                    if (err.status == 409) {
                        Swal.fire({
                            position: 'top-end',
                            title: 'Room not available',
                            text: errorMessage,
                            icon: 'info',
                            confirmButtonText: 'ตกลง',
                        });
                    } else {
                        // แสดง Swal Alert
                        Swal.fire({
                            position: 'top-end',
                            title: 'Booking Room Error!',
                            text: errorMessage,
                            icon: 'error',
                            confirmButtonText: 'ตกลง',
                        });
                    }
                },
            });

            this.spinner.hide();
        }
    }

     formatDate(date: string): string {
        const inputDate = new Date(date);
        const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        
        const day = inputDate.getDate(); // ดึงวันที่ (1-31)
        const month = months[inputDate.getMonth()]; // ดึงเดือน (0-11) แล้วแปลงเป็นตัวอักษรย่อ
        const year = inputDate.getFullYear(); // ดึงปี (เช่น 2024)
    
        return `${day}-${month}-${year}`;
    }
    onBookNow(element: any): void {
        console.log(element);
        this.RoomSearchClassApplied=! this.RoomSearchClassApplied;
        this.classApplied = !this.classApplied;

        this.roomSelected  = this.roomOption.find(room => room.id === element.id.toString())|| null;
        this.roomSelectedId=element.id.toString()
        const selectedDate = element.searchDate;
        this.selectedTimeFrom= element.searchTimeFrom;

        this.selectedTimeTo= element.searchTimeTo;
        console.log('Selected Date:',selectedDate); 
        console.log('selectedTimeFrom :',this.selectedTimeFrom); 

       
        
        this.bookingForm.get('BookingDate')?.setValue(new Date(selectedDate)); 
        this.bookingForm.get('BookingDate')?.disable();
        this.bookingForm.get('BookingRoomId')?.disable();
        this.bookingForm.get('BookingTimeFrom')?.disable();
        this.bookingForm.get('BookingTimeTo')?.disable();

       
    }
    
    onSearchRoom()
   {
    if (this.searchRoomForm.valid) {
        this.spinner.show();
        const searchRoomRequest: SearchRoomRequest = {
            date: this.searchRoomForm.get('searchDate')?.value,    // Date เก็บเป็น string
            timeFrom: this.searchRoomForm.get('searchTimeFrom')?.value,   // TimeFrom เก็บเป็น string
            timeTo: this.searchRoomForm.get('searchTimeTo')?.value,            
        };

        this.roomService.searchAvaliableRoom(searchRoomRequest).subscribe({
            next: (res) => {
                this.RoomElementData = res.map((room:any) => ({
                    id:room.id,
                    roomImg: room.files[0],
                    roomName: room.roomName,
                    roomLocation: room.roomLocation,
                    roomFloor: room.roomFloor,
                    seatCount: room.seatCount,
                    searchDate:this.formatDate(searchRoomRequest.date),
                    searchTimeFrom: searchRoomRequest.timeFrom,
                    searchTimeTo: searchRoomRequest.timeTo, 
                }));
                this.dataSource.data = this.RoomElementData;
                this.spinner.hide();            
            },
            error: (err) => {
                console.error('Error Received Response: ', err);

                let errorMessage =
                    'An unexpected error occurred. Please try again later.';

                // ตรวจสอบข้อผิดพลาดที่ส่งกลับจาก API
                if (err.error && err.error.message) {
                    errorMessage = err.error.message;
                } else if (err.status === 0) {
                    // กรณี API ไม่ตอบสนอง (Network error)
                    errorMessage =
                        'Unable to connect to the server. Please check your internet connection.';
                } else if (err.status === 400) {
                    // กรณีข้อมูลไม่ถูกต้อง
                    errorMessage =
                        'Invalid input. Please check your data and try again.';
                } else if (err.status === 409) {
                    // กรณี Conflict เช่น ห้องไม่ว่าง
                    errorMessage =
                        'The room is already booked during the selected time.';
                } else if (err.status >= 500) {
                    // กรณีเซิร์ฟเวอร์เกิดข้อผิดพลาด
                    errorMessage =
                        'Server error occurred. Please contact support.';
                }
                this.spinner.hide();

                if (err.status == 409) {
                    Swal.fire({
                        position: 'top-end',
                        title: 'Room not available',
                        text: errorMessage,
                        icon: 'info',
                        confirmButtonText: 'ตกลง',
                    });
                } else {
                    // แสดง Swal Alert
                    Swal.fire({
                        position: 'top-end',
                        title: 'Search Avaliable Room Error!',
                        text: errorMessage,
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                    });
                }
            },
        });

        this.spinner.hide();
    }

   }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.paginator.pageSize = 4; 
       
    }

    groupByRoomId(bookings: booking[]): GroupedBookings {
        if (!Array.isArray(bookings)) {
            throw new Error('groupByRoomId Input is not an array');
        }
        return bookings.reduce((acc: GroupedBookings, booking: booking) => {
            const roomId = booking.RoomId ?? 0;

            if (!acc[roomId]) {
                acc[roomId] = [];
            }
            acc[roomId].push(booking);
            return acc;
        }, {});
    }
    toggleRoomdDetailClass() {
        this.classRoomdDetailApplied = !this.classRoomdDetailApplied;
    }
    toggleClass() {
        this.classApplied = !this.classApplied;
    }
    toggleSearchClass() {
        this.RoomSearchClassApplied = !this.RoomSearchClassApplied;
    }


}

export interface RoomElement {
    roomNo: string;
    roomImg: { img: string; name: string }[]; // ปรับให้เป็น array ของ object
    roomName: string; // หรือ any หากต้องการ
    roomLocation: string;
    seatCount: string;
    facilities: string;
    status: { rejected: string; confirmed?: string; pending?: string };
    action: { view: string; delete: string; edit: string };
};

export interface RoomAvailable {
    id: number;
    roomImg: tFile; // ปรับให้เป็น array ของ object
    roomName: string; // หรือ any หากต้องการ
    roomLocation: string;
    roomFloor: string;
    seatCount: string;  
    searchDate: string;  
    searchTimeFrom: string; 
    searchTimeTo: string; 
};
