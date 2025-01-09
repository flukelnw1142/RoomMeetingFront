import { Component, ViewChild } from '@angular/core';
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
import { FullCalendarModule } from '@fullcalendar/angular';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../../common/header/header.component';
import { RoomService } from '../../services/room/room.service';
import { CommonModule } from '@angular/common';
import {
    MatDatepickerInputEvent,
    MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { booking, bookingDetail, defaultBookingDetail, GroupedBookings, SearchRoomRequest, tFile } from '../../model/dashboard';
import Swal from 'sweetalert2';
import { RoomComponent } from '../room/room.component';
import { UtilityService } from '../../services/utility.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import timeGridPlugin from '@fullcalendar/timegrid';
import { convertToLocalISOString } from '../../utils/date-utils';
import { RoomList } from '../../model/room.interface';

@Component({
    selector: 'app-new-dashboard',
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
    templateUrl: './new-dashboard.component.html',
    styleUrl: './new-dashboard.component.scss',
})
export class NewDashboardComponent {
    datePickerFilter = (date: Date | null): boolean => {
        if (!date) {
          return false;
        }
        const today = new Date(); 
        today.setHours(0, 0, 0, 0); 
        return date >= today; 
      };
    
    filterWednesdayAndFriday = (date: Date | null): boolean => {
        if (!date) return false;

        const day = date.getDay(); 
        const today = new Date(); 
        today.setHours(0, 0, 0, 0); 
        return (day === 3 || day === 5) && date >= today; 
    };

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
    roomSelected: {
        id: string;
        name: string;
        Seats: string;
        Facilities: string;
        img: tFile[];
        RoomType: string;
    } | null;
    roomData: RoomElement[] = [];
    roomDataSource = new MatTableDataSource<RoomElement>(this.roomData);

    roomSelectedId: string;

    roomOption: {
        id: string;
        name: string;
        Seats: string;
        Facilities: string;
        img: tFile[];
        RoomType: string;
    }[];

    selected: Date | null;
    today = new Date();
    bookingForm: FormGroup;
    searchRoomForm: FormGroup;
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
    RoomSearchClassApplied = false;
    selectedTopic: any;
    bookingFromTime: string = '';
    bookingToTime: string = '';
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
        loop: false,
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
    roomList: RoomList[] = [];
    availableTimesFrom: string[] = [];
    minDate: Date;
    availableTimesTo: string[] = [];
    empId: string = '';
    selectedTimeFrom: string = '';
    selectedTimeTo: string = '';

    selectedTimeFromEdit: string = '';
    selectedTimeToEdit: string = '';


    errorMessage: string = '';

    selectedTime: string = '';
    timeRangErrorMessage: string = '';
    displayValue: string | null = null;
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
            this.loadOptions();
        });
        this.utilityService.event$.subscribe((data) => {
            this.empId = data.emp_id_message;
            this.RoomSearchClassApplied = data.search_room;
            this.classApplied = data.add_booking_btn;
        });
        this.loadOptions();
        this.searchRoomForm = this.fb.group({
            searchDate: ['', [Validators.required]],
            searchTimeFrom: ['', [Validators.required]],
            searchTimeTo: ['', [Validators.required]],
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
                    Validators.pattern(/^\d{4}$|^\d{10}$/)
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
                    Validators.pattern(/^\d{4}$|^\d{10}$/)
                ]
            ]
        });
        this.getRoomList();
        this.checkSlides();
        this.bookingForm.get('BookingRoomId')?.valueChanges.subscribe((date: string) => {
            const test = new Date(date);
            const fix =  convertToLocalISOString(test)
            const formattedDate = fix.split('T')[0];
            console.log("this.roomSelectedId", this.roomSelectedId);
            const id = Number(this.roomSelectedId)
            console.log("formattedDate", formattedDate);
            this.roomService.getAvailableTimeSlots(id, formattedDate).subscribe({
                next: (response) => {
                    console.log("response", response); // ตรวจสอบข้อมูล
                    this.availableTimesFrom = response; // เก็บข้อมูลในตัวแปร
                    console.log("Available Times: ", this.availableTimesFrom); // แสดงข้อมูลเพื่อความมั่นใจ
                },
                error: (error) => {
                    console.error('Error loading options:', error);
                },
            });
        });
        this.bookingForm.get('BookingDate')?.valueChanges.subscribe((date: string) => {
            const test = new Date(date);
            const fix =  convertToLocalISOString(test)
            const formattedDate = fix.split('T')[0];
            console.log("this.roomSelectedId", this.roomSelectedId);
            const id = Number(this.roomSelectedId)
            console.log("formattedDate", formattedDate);
            this.roomService.getAvailableTimeSlots(id, formattedDate).subscribe({
                next: (response) => {
                    console.log("response", response); // ตรวจสอบข้อมูล
                    this.availableTimesFrom = response; // เก็บข้อมูลในตัวแปร
                    console.log("Available Times: ", this.availableTimesFrom); // แสดงข้อมูลเพื่อความมั่นใจ
                },
                error: (error) => {
                    console.error('Error loading options:', error);
                },
            });
        });
        this.bookingForm.get('BookingTimeFrom')?.valueChanges.subscribe((time: string) => {
            const fix =  convertToLocalISOString(this.bookingForm.value.BookingDate)
            const formattedDateFrom = fix.split('T')[0];
            console.log("this.roomSelectedId", this.roomSelectedId);
            const id = Number(this.roomSelectedId)
            console.log("formattedDateFrom", formattedDateFrom);
            
            this.roomService.getAvailableTimeRanges(id, formattedDateFrom,time).subscribe({
                next: (response) => {
                    console.log("response", response); // ตรวจสอบข้อมูล
                },
                error: (error) => {
                    console.error('Error loading options:', error);
                },
            });
        });
        const today = new Date();
        const format = this.formatDate(today.toString())
        this.bookingForm.get('BookingDate')?.setValue(today);
        this.displayValue = format;
        console.log("5555555555555",this.displayValue);
        
    }

    calendarOptions: CalendarOptions = {
        initialView: 'dayGridMonth',
        dayMaxEvents: true,
        events: this.monthlyEvent,
        plugins: [dayGridPlugin, timeGridPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        views: {
            dayGridMonth: { buttonText: ' ' },
            timeGridWeek: { buttonText: ' ' },
            timeGridDay: { buttonText: ' ' },
        },
        eventContent: function (arg) {
            let title = arg.event.title;
            const eventType = arg.event.extendedProps['type'];
            var typColour = '';

            if (title.length > 18) {
                return {
                    html: `<div class="fc-event-title" style="background-color:${typColour} ;">${title}</div>`,
                };
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
    };
    onKeyup(event: KeyboardEvent): void {
        const input = (event.target as HTMLInputElement).value;
        console.log('User input:', input);
    }

    handleEventClick(arg: any): void {
        this.toggleRoomdDetailClass();
        const bookingNo = arg.event.extendedProps['bookingNo'];
        this.loadDetailRoom(bookingNo);
        console.log('Event clicked:', arg.event);
        const popoverElements = document.querySelectorAll('.fc-popover');
        popoverElements.forEach((popover) => {
            (popover as HTMLElement).style.top = '186px';
            (popover as HTMLElement).style.left = '450px';
        });
    }

    initializeTimesFrom(selectedDate: Date): void {
        const selectedTime = new Date(selectedDate);
        const currentTime = new Date();
        const selectedDay = selectedTime.toDateString();
        const currentDay = currentTime.toDateString();
        const isToday = selectedDay === currentDay;
        const startHour = isToday ? currentTime.getHours() : 0;
        const startMinute = isToday ? currentTime.getMinutes() : 0;
        this.availableTimesFrom = [];
        // for (let hour = startHour; hour < 24; hour++) {
        //     for (let minute = 0; minute < 60; minute += 30) {
        //         if (
        //             hour > startHour ||
        //             (hour === startHour && minute > startMinute) ||
        //             !isToday
        //         ) {
        //             this.availableTimesFrom.push(
        //                 `${hour.toString().padStart(2, '0')}:${minute
        //                     .toString()
        //                     .padStart(2, '0')}`
        //             );
        //         }
        //     }
        // }

        this.selectedTimeFrom = this.availableTimesFrom[0] || '';
        this.availableTimesTo = [...this.availableTimesFrom];
        console.log('this.selectedTimeFrom' + this.selectedTimeFrom);
    }

    loadDetailRoom(bookingNo: string): void {
        this.roomService.getBookingsRoomDetail(bookingNo).subscribe({
            next: (res) => {
                if (!res.success) {
                } else {
                    const booking = res.data;

                    this.bookingDetail = {
                        bookingNo: booking.bookingNo || '',
                        roomId: booking.roomId || '',
                        roomName: booking.roomName || '',
                        roomLocation: booking.roomLocation || null,
                        roomFloor: booking.roomFloor || null,
                        description: booking.description || '',
                        bookingDate: booking.bookingDate || '',
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
                        BookingRoomId: [this.bookingDetail.roomId, [Validators.required]],
                        BookingDate: ['', [Validators.required]],
                        BookingType: [this.bookingDetail.bookingType, [Validators.required]],
                        BookingTimeFrom: [this.bookingDetail.bookingFrom, [Validators.required]],
                        BookingTimeTo: [this.bookingDetail.bookingTo, [Validators.required]],
                        BookingTopic: [this.bookingDetail.bookingSubject, [Validators.required]],
                        Description: [this.bookingDetail.description, [Validators.required]],
                        Phone: [this.bookingDetail.bookingByMobile, [Validators.required]],
                    });

                    this.bookingEditForm.get('BookingDate')?.setValue(new Date(this.bookingDetail.bookingDate));
                    this.selectedTimeFromEdit = this.bookingDetail.bookingFrom ?? "";
                    this.selectedTimeToEdit = this.bookingDetail.bookingTo ?? "";
                    this.initializeTimesFrom(new Date(this.bookingDetail.bookingDate));

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

    private timeStringToMinutes(time: string): number {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    onSearchDateSelected(event: MatDatepickerInputEvent<Date>): void {
        const selectedDate = event.value;
        if (selectedDate) {
            this.initializeTimesFrom(selectedDate);
        } else {
            console.log('No date selected');
        }
    }
    onAddbookingDateSelected(event: MatDatepickerInputEvent<Date>): void {
        const selectedDate = event.value;
        if (selectedDate) {
            this.displayValue = this.formatDate(selectedDate.toString()); // อัพเดตค่าที่แสดง
          }
        console.log('onAddbookingDateSelected :', selectedDate);
        if (selectedDate) {
            this.initializeTimesFrom(selectedDate);
        } else {
            console.log('No date selected');
        }
    }

    compareDateWithMoment(selectedDate: string): boolean {
        const today = moment();
        const selected = moment(selectedDate, 'YYYY-MM-DD');

        return today == selected;
    }


    loadOptions(): void {
        this.roomService.getOptions("active").subscribe({
            next: (data) => {
                this.roomOption = data.map((item) => ({
                    id: String(item.id),
                    name: item.roomName + ' Floor ' + item.roomFloor,
                    Seats: item.seatCount,
                    Facilities: item.facilities,
                    img: item.files || [],
                    RoomType: item.RoomType
                }));
                if (this.roomOption.length > 0) {
                    this.roomSelected = this.roomOption[0];
                    this.loadTodayBookiog(Number(this.roomSelected.id));
                    this.loadAllBookiogByRoom(Number(this.roomSelected.id));
                    this.roomSelectedId = this.roomSelected.id;

                } else {
                    this.roomSelected = null;
                }



                console.log('load data options:', data);
                console.log('load ROOM options:', this.roomOption);
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
                    ...this.calendarOptions,
                    events: this.monthlyEvent,
                };
                console.log(' this.monthlyEvent :', this.monthlyEvent);
            },
            error: (error) => {
                console.error('Error monthlyEvent:', error);
            },
        });
    }

    getImageSrc(image: {
        id: number;
        roomId: number;
        fileType: string;
        filePath: string;
        fileName: string;
        labelText?: string;
        uploadedDate: Date;
        uploadedBy?: string;
    }): string {
        return `${image.fileName}`;
    }

    onCategoryChange(roomId: number): void {
        console.log('Selected Room ID:', roomId);

        this.roomSelected = this.roomOption.find(room => room.id === roomId.toString()) || null;
        console.log('Selected Room Object:', this.roomSelected);
        const id = Number(this.roomSelectedId);
        const selectedRoom = this.roomList.find((room) => room.ID === id);
        if (selectedRoom?.ROOM_TYPE === 'Massage') {
            this.datePickerFilter = this.filterWednesdayAndFriday;
            this.bookingForm.patchValue({
                BookingDate: ''
            });
            this.displayValue = '';
        }
        else {
            this.datePickerFilter = (date: Date | null) => {
                if (!date) {
                    return false;
                }
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date >= today; 
            };
            const today = new Date();
            this.displayValue = this.formatDate(today.toString())
            this.bookingForm.get('BookingDate')?.setValue(today);
        }
        this.loadTodayBookiog(roomId);
        console.log('Called loadTodayBookiog with Room ID:', roomId);

        this.loadAllBookiogByRoom(roomId);
        console.log('Called loadAllBookiogByRoom with Room ID:', roomId);
    }

    onBookingSubmit() {
        console.log(this.bookingForm.value);

        if (this.bookingForm.valid) {
            this.spinner.show();

            const rawBookingDate = this.bookingForm.get('BookingDate')?.value;
            const bookingDate = new Date(rawBookingDate);
            bookingDate.setHours(0, 0, 0, 0);

            const bookingFromTime = this.bookingForm.get('BookingTimeFrom')?.value;
            const bookingToTime = this.bookingForm.get('BookingTimeTo')?.value;

            const [fromHour, fromMinute] = bookingFromTime.split(':');
            const [toHour, toMinute] = bookingToTime.split(':');

            const bookingFrom = new Date(bookingDate);
            bookingFrom.setHours(Number(fromHour), Number(fromMinute), 0, 0);

            const bookingTo = new Date(bookingDate);
            bookingTo.setHours(Number(toHour), Number(toMinute), 0, 0);

            const bookingRequest: Array<{ FieldName: string; FieldValue: string }> = [
                { FieldName: 'ROOM_ID', FieldValue: this.bookingForm.get('BookingRoomId')?.value.toString() },
                { FieldName: 'BOOKING_DATE', FieldValue: convertToLocalISOString(bookingDate) },
                { FieldName: 'BOOKING_FROM', FieldValue: convertToLocalISOString(bookingFrom) },
                { FieldName: 'BOOKING_TO', FieldValue: convertToLocalISOString(bookingTo) },
                { FieldName: 'BOOKING_BY', FieldValue: 'janedoe' },
                { FieldName: 'BOOKING_BY_NAME', FieldValue: 'Jane Doe' },
                { FieldName: 'BOOKING_BY_CONTACT', FieldValue: this.bookingForm.get('Phone')?.value },
                { FieldName: 'BOOKING_TYPE', FieldValue: this.bookingForm.get('BookingType')?.value },
                { FieldName: 'BOOKING_SUBJECT', FieldValue: this.bookingForm.get('BookingTopic')?.value },
                { FieldName: 'BOOKING_DETAIL', FieldValue: this.bookingForm.get('Description')?.value },
                { FieldName: 'BOOKING_BY_EMAIL', FieldValue: 'janedoe@example.com' },
                { FieldName: 'BOOKING_ATTENDEES', FieldValue: 'John, Mike, Sarah' },
                { FieldName: 'REMARK', FieldValue: 'Bring laptops' },
                { FieldName: 'CREATED_BY', FieldValue: 'admin' }
            ];

            console.log('Final Booking Request:', bookingRequest);

            this.roomService.addNewBooking(bookingRequest).subscribe({
                next: (res) => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'New booking has been saved successfully',
                        showConfirmButton: false,
                        timer: 2500,
                    });
                    this.clearBookingForm();
                    this.classApplied = false
                    this.spinner.hide();
                    this.onCategoryChange(res.data);

                },
                error: (err) => {
                    this.spinner.hide();
                    console.log(err);

                    Swal.fire({
                        position: 'top-end',
                        title: 'Booking Room Error!',
                        text: err.error.error,
                        icon: 'error',
                        confirmButtonText: 'OK',
                    });
                },
            });

            this.spinner.hide();
        }
    }

    formatDate(date: string): string {
        const inputDate = new Date(date);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const day = inputDate.getDate();
        const month = months[inputDate.getMonth()];
        const year = inputDate.getFullYear();

        return `${day}-${month}-${year}`;
    }

    onBookNow(element: any): void {
        console.log(element);
        this.RoomSearchClassApplied = !this.RoomSearchClassApplied;
        this.classApplied = !this.classApplied;

        this.roomSelected = this.roomOption.find(room => room.id === element.id.toString()) || null;
        this.roomSelectedId = element.id.toString()
        const selectedDate = element.searchDate;
        this.selectedTimeFrom = element.searchTimeFrom;

        this.selectedTimeTo = element.searchTimeTo;
        console.log('Selected Date:', selectedDate);
        console.log('selectedTimeFrom :', this.selectedTimeFrom);

        this.bookingForm.get('BookingDate')?.setValue(new Date(selectedDate));
        this.bookingForm.get('BookingDate')?.disable();
        this.bookingForm.get('BookingRoomId')?.disable();
        this.bookingForm.get('BookingTimeFrom')?.disable();
        this.bookingForm.get('BookingTimeTo')?.disable();
    }

    onSearchRoom() {
        if (this.searchRoomForm.valid) {
            this.spinner.show();
            const searchRoomRequest: SearchRoomRequest = {
                date: this.searchRoomForm.get('searchDate')?.value,
                timeFrom: this.searchRoomForm.get('searchTimeFrom')?.value,
                timeTo: this.searchRoomForm.get('searchTimeTo')?.value,
            };

            this.roomService.searchAvaliableRoom(searchRoomRequest).subscribe({
                next: (res) => {
                    this.RoomElementData = res.map((room: any) => ({
                        id: room.id,
                        roomImg: room.files[0],
                        roomName: room.roomName,
                        roomLocation: room.roomLocation,
                        roomFloor: room.roomFloor,
                        seatCount: room.seatCount,
                        searchDate: this.formatDate(searchRoomRequest.date),
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

                    if (err.error && err.error.message) {
                        errorMessage = err.error.message;
                    } else if (err.status === 0) {
                        errorMessage =
                            'Unable to connect to the server. Please check your internet connection.';
                    } else if (err.status === 400) {
                        errorMessage =
                            'Invalid input. Please check your data and try again.';
                    } else if (err.status === 409) {
                        errorMessage =
                            'The room is already booked during the selected time.';
                    } else if (err.status >= 500) {
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

    openSearchRoom() {
        this.utilityService.sendEvent(this.empId, false, false, false, true); // เปิด openRoomSetting ปิดปุ่ม add 
    }

    checkSlides(): void {
        if (this.roomSelected && this.roomSelected.img && this.roomSelected.img.length > 1) {
            this.imageSlides = {
                ...this.imageSlides,
                loop: true,
                autoplay: false,
                nav: false,
                dots: false,
            };
        }
    }

    getRoomList() {
        this.roomService.GetAllRooms().subscribe({
            next: (res) => {
                console.log('roomList :', res);
                this.roomList = res
                console.log('roomList :', this.roomList);
            },
            error: (error) => {
                console.error('Error loading options:', error);
            },
        });
    }

    onInputChange(event: Event): void {
        const input = (event.target as HTMLInputElement).value;
        this.displayValue = input; // ใช้ค่าที่กรอก
    }

    clearBookingForm(){
        this.bookingForm.patchValue({
            BookingRoomId: '',
            BookingDate: '',
            BookingType: '',
            BookingTimeFrom: '',
            BookingTimeTo: '',
            BookingTopic: '',
            Description: '',
            Phone: ''
        });
    }

}

export interface RoomElement {
    roomNo: string;
    roomImg: { img: string; name: string }[];
    roomName: string;
    roomLocation: string;
    seatCount: string;
    facilities: string;
    status: { rejected: string; confirmed?: string; pending?: string };
    action: { view: string; delete: string; edit: string };
};

export interface RoomAvailable {
    id: number;
    roomImg: tFile;
    roomName: string;
    roomLocation: string;
    roomFloor: string;
    seatCount: string;
    searchDate: string;
    searchTimeFrom: string;
    searchTimeTo: string;
};