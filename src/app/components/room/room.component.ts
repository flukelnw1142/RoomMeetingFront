import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UtilityService } from '../../services/utility.service';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
    NgxFileDropEntry,
    FileSystemFileEntry,
    FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RoomService } from '../../services/room/room.service';
import Swal from 'sweetalert2';
import { roomDto } from '../../model/dashboard';
// import { FileSystemFileEntry, NgxFileUploadEntry } from '@iplab/ngx-file-upload';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { Console } from 'console';
// import { RadiosWithNgmodelComponent } from './radios-with-ngmodel/radios-with-ngmodel.component';
import { DashboardComponent } from '../dashboard/dashboard.component'; // นำเข้า ChildComponent
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-room',
    standalone: true,
    imports: [
        CommonModule,DashboardComponent,NgxSpinnerModule,
        NgxFileDropModule,
        MatSlideToggleModule,
        MatTableModule,
        CarouselModule,
        MatRadioModule,
        MatPaginator,
        MatPaginatorModule,
        FileUploadModule,
        ReactiveFormsModule,
        FormsModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatMenuModule,
        MatCardModule,
    ],
    templateUrl: './room.component.html',
    styleUrl: './room.component.scss',
})
export class RoomComponent {
    @Input() empId: string = '';
    @ViewChild(DashboardComponent) DashboardComponent!: DashboardComponent; // เข้าถึง ChildCompo
    
    ELEMENT_DATA: PeriodicElement[] = [];

    RoomSettingClassApplied = false;
    Statusselected =  '1';
    AddRoomClassApplied = false;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    displayedColumns: string[] = [
    
        'roomName',
        'facilities',
        'status',
        'action',
    ];
    router: any;

    @Output() onFileSelected = new EventEmitter<File>();
    
    roomForm : FormGroup;
    addRoomForm  : FormGroup;
    editRoomForm  : FormGroup;
    roomList: roomDto[];
    roomDetail: roomDto;
    constructor(
        private roomfb: FormBuilder,
        private utilityService: UtilityService,
        private http: HttpClient,
        private roomService: RoomService,
        private RoomSpinner: NgxSpinnerService
    ) {}
    options: { id: number; name: string }[] = [];
    location_selected: string = '1';
    selectedImg: File[] = [];
    fileNames: string[] = [];
    maxFiles = 3;
    images: {
        url: string;
        title: string;
        Seats: number;
        Facilities: string;
    }[] = [];
    mode: 'add' | 'edit' | 'view' = 'view'; // โหมดเริ่มต้น
    fileErrorMessage: string = '';
    roomStatus: boolean = true;
     Facilities = new FormControl('');
    FacilitiesSelected : string[]=[] ;
    FacilitiesList: string[] = [
        'Whiteboard',
        'TV Presentation',
        'VDO Conference'        
    ];
    dropZoneLabel: string = 'Drop files here';
     validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    RoomSlides: OwlOptions = {
        items: 1,
        nav: false,
        loop: true,
        margin: 25,
        dots: true,
        autoplay: false,
        smartSpeed: 1000,
        autoplayHoverPause: true,
        navText: [
            "<i class='flaticon-chevron-1'></i>",
            "<i class='flaticon-chevron'></i>",
        ],
    };
    onDebugEvent(event: any): void {
        console.log('Event triggered:', event);
    }

  
    public files: NgxFileDropEntry[] = [];

    public addDropped(files: NgxFileDropEntry[]) {
        // Limit to maxFiles and filter only image files
        const selectedFiles = files.slice(0, this.maxFiles);
        const maxFilesAllowed = 3; // Maximum number of files allowed
        this.selectedImg = []; // Clear previous selections
        this.addfilesArray.clear(); // Clear previous selections
        const imageFiles: NgxFileDropEntry[] = [];
        if (files.length >  this.maxFiles) {
            Swal.fire({
                position: 'top-end',
                title: 'Maximum File Limit Reached',
                text: `You can upload up to ${maxFilesAllowed} files only.`,
                icon: 'warning',
                confirmButtonText: 'ตกลง',
            });
            
        }
        else
        {
            for (const droppedFile of selectedFiles) {     
    
                if (droppedFile.fileEntry.isFile) {
                    const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                    fileEntry.file((file: File) => {
                        if (this.validImageTypes.includes(file.type)) {
                            // Add only valid files to the imageFiles array
                            imageFiles.push(droppedFile);
        
                            // Process each valid image file immediately
                            const formData = new FormData();
                            formData.append('logo', file, droppedFile.relativePath);
        
                            console.log(droppedFile.relativePath, file);
        
                            this.selectedImg.push(file);
                            this.addfilesArray.push(
                                this.roomfb.control(file, Validators.required)
                            );
                        } else {
                            Swal.fire({
                                position: 'top-end',
                                title: 'Add Image Files Error!',
                                text: `Invalid file type: ${file.type}`,
                                icon: 'error',
                                confirmButtonText: 'ตกลง',
                            });
                        }
                    });
                } else {
                    // Handle directories (if required)
                    const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
                    console.log(droppedFile.relativePath, fileEntry);
                }
            }
        
            // Log the selected images after processing
            if (this.selectedImg.length === 0) {
                Swal.fire({
                    position: 'top-end',
                    title: 'Add Image Files Error!',
                    text: 'No valid image files selected.',
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                });
            }
        }
  
    }
    mapApiDataToFiles(data: any[]): void {
        this.selectedImg = data.map((item) => {
          const fileBlob = new Blob([], { type: item.fileType }); // สร้าง Blob เปล่าสำหรับไฟล์
          return new File([fileBlob], item.fileName, { type: item.fileType }); // สร้าง File object
        });
      }
    
    public editDropped(files: NgxFileDropEntry[]) {
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxFiles = 3;

        // Limit to maxFiles and filter only image files
        const selectedFiles = files.slice(0, maxFiles);
        this.selectedImg = []; // Clear previous selections
        this.addfilesArray.clear();// Clear previous selections
        const imageFiles: NgxFileDropEntry[] = [];

        for (const droppedFile of selectedFiles) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    if (validImageTypes.includes(file.type)) {
                        // Add only valid files to the imageFiles array
                        imageFiles.push(droppedFile);

                        // Process each valid image file immediately
                        const formData = new FormData();
                        formData.append('logo', file, droppedFile.relativePath);

                        console.log(droppedFile.relativePath, file);

                        this.selectedImg.push(file);
                        this.addfilesArray.push(this.roomfb.control(file, Validators.required));
                    } else {
                        console.error(`Invalid file type: ${file.type}`);
                    }
                });
            } else {
                // Handle directories (if required)
                const fileEntry =
                    droppedFile.fileEntry as FileSystemDirectoryEntry;
                console.log(droppedFile.relativePath, fileEntry);
            }
        }

        // Log the selected images after processing
        if (this.selectedImg.length === 0) {
            console.error('No valid image files selected.');
        }
    }

    public fileOver(event: Event) {
        console.log(event);
    }

    public fileLeave(event: Event) {
        console.log(event);
    }
    onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const files = input.files;
        // const file = event.target.files ? event.target.files[0] : null;
        const getfile = event.currentTarget as HTMLInputElement;
        if (files) {
            const maxFiles = 3; // กำหนดจำนวนไฟล์สูงสุด
            const allowedTypes = [
                'image/png',
                'image/jpeg',
                'image/jpg',
                'image/gif',
                'image/webp'
              
            ]; // ประเภทไฟล์ที่ยอมรับ

            // ตรวจสอบจำนวนไฟล์
            if (files.length > maxFiles) {
                alert(`You can only select up to ${maxFiles} files.`);
                input.value = ''; // ล้างไฟล์ที่เลือก
                return;
            }

            // ตรวจสอบประเภทของไฟล์
            const invalidFiles = Array.from(files).filter(
                (file) => !allowedTypes.includes(file.type)
            );

            if (invalidFiles.length > 0) {
                alert(`Only image files (PNG, JPEG, JPG, GIF) are allowed.`);
                input.value = ''; // ล้างไฟล์ที่เลือก
                return;
            }

            // หากไฟล์ทั้งหมดผ่านการตรวจสอบ
            console.log('Selected files:', files);
        }
    }
      // Getter สำหรับดึง FormArray
  get addfilesArray(): FormArray {
    return this.addRoomForm.get('files') as FormArray;
  }

  ngOnInit() {
    this.initializeForms() 
        this.loadAllRoom();
        this.utilityService.event$.subscribe((data) => {
            this.empId = data.emp_id_message;
            this.RoomSettingClassApplied = data.room_setting_dialog;
            this.AddRoomClassApplied = data.room_add_dialog;
            console.log('subscribe :' + this.empId);
            this.switchMode('add');           
        });
    }

    seatRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value;
        if (!value) {
          return null; // ไม่มีค่า ไม่ตรวจสอบ
        }
    
        const parts = value.split('-');
        if (parts.length === 2) {
          const xx = parseInt(parts[0], 10);
          const yy = parseInt(parts[1], 10);
    
          if (isNaN(xx) || isNaN(yy) || xx >= yy) {
            return { invalidRange: true }; // ข้อผิดพลาด: xx >= yy
          }
        }
    
        return null; // ข้อมูลถูกต้อง
      }

    initializeForms() {
        this.addRoomForm = this.roomfb.group({
            RoomName: [
                '', 
                [Validators.required, Validators.maxLength(20)] // เพิ่ม Validators.maxLength
              ],
            RoomLocation: ['', [Validators.required]],
            RoomFloor: ['', [Validators.required]],
            SeatCount: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{2}-\d{2}$/), // ตรวจสอบรูปแบบ xx-yy
          this.seatRangeValidator // ตรวจสอบว่า yy > xx
        ]
      ],
            files: this.roomfb.array([], [Validators.required]),
            Facilities: '',
            Remark: '',
            RoomType:'Meeting',
            Status: true,
        });
    
        this.editRoomForm = this.roomfb.group({
            RoomName: ['', [Validators.required]],
            RoomLocation: ['', [Validators.required]],
            RoomFloor: ['', [Validators.required]],
            SeatCount: ['', [Validators.required]],
            files: this.roomfb.array([]), // ไม่ต้อง required
            Facilities: ['', [Validators.required]],
            Remark: ['', [Validators.required]],
            Status: true,
        });
    }
    clearAddRoomForm(): void {
        this.addRoomForm.reset({
            RoomName: '',
            RoomLocation: '',
            RoomFloor: '',
            SeatCount: '',
            files: [],
            Facilities: '',
            Remark: '',
            RoomType:'Meeting',
            Status: true,
           
        });
        this.selectedImg=[];
        this.addRoomForm.get('Facilities')?.setValue([]);
        this.Facilities  = new FormControl('');
       
    }
    loadAllRoom(): void {
        this.roomService.getAllRoom().subscribe({
            next: (res) => {
                this.roomList = res.data.map((room: any) => ({
                    id: room.id,
                    roomName: room.roomName,
                    roomLocation: room.roomLocation,
                    roomFloor: room.roomFloor,
                    seatCount: room.seatCount,
                    facilities: room.facilities,
                    status: room.status ?? 0, // ถ้ามีค่าจะเก็บสถานะห้อง, ถ้าไม่มีจะเก็บเป็น null
                    remark: room.remark,
                    createdBy: room.createdBy,
                    createdDate: new Date(room.createdDate),
                    modifiedBy: room.modifiedBy,
                    modifiedDate: new Date(room.modifiedDate),
                    files: room.files || [], // ถ้ามีไฟล์ก็ใส่เข้าไป ถ้าไม่มีให้เป็น array ว่าง
                }));

                this.ELEMENT_DATA = this.roomList.map((room: any) => ({
                    roomNo: room.id, // แปลง ID ให้เป็น string
                    roomImg: room.files
                        ? room.files.map((file: any) => ({
                              img: file.fileName, // URL รูปภาพ
                              name: file.filePath, // ชื่อไฟล์
                          }))
                        : [], // หากไม่มีไฟล์ ให้เป็น array ว่าง
                    roomName: room.roomName || '', // ใช้ค่าเริ่มต้นเป็น '' หากไม่มีค่า
                    roomLocation:
                        `${room.roomLocation} Floor ${room.roomFloor}` || '',
                    seatCount: room.seatCount.toString(), // แปลงเป็น string
                    facilities: room.facilities || '',
                    status: {
                        //  rejected: room.status === 0 ? 'Inactive' : '', // ตัวอย่างการกำหนดค่าตาม status
                        confirmed: room.status === 1 ? 'Active' : '',
                        rejected: room.status === 0 ? 'Inactive' : '',

                        // rejected: room.status === 4 ? 'Rejected' : undefined,
                    },
                    action: {
                        view: 'visibility', // ค่าเริ่มต้นสำหรับปุ่ม action
                        delete: 'delete',
                        edit: 'edit',
                    },
                }));
                 
                this.dataSource.data = this.ELEMENT_DATA;
                //this.dataSource.paginator = this.paginator;
                //this.selectedImages = this.images[1];
                console.log('images loading options:', res);
            },
            error: (error) => {
                console.error('Error loading options:', error);
            },
        });
    }
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;

        this.paginator.pageSize = 4; 
       
        // this.sort.active = 'id'; // คอลัมน์ที่ต้องการจัดเรียงเริ่มต้น
        // this.sort.direction = 'asc'; // ทิศทางการจัดเรียง: 'asc' หรือ 'desc'
        // this.dataSource.sort = this.sort;
    }

    getFormattedFacilities(roomFacilities: string): string[] {
        return roomFacilities.split(',').map((item) => item.trim());
    }



    onViewDetail(element: any): void {
        this.roomService.getRoomDetail(element.roomNo).subscribe({
            next: (res) => {
                this.AddRoomClassApplied = true;
                this.RoomSettingClassApplied = false;
                this.roomDetail = this.mapToRoomDto(res.data);
                this.switchMode('view');
            },
            error: (err) => {
                console.log('Error Received Response:' + err.error.message);
                Swal.fire({
                    position: 'top-end',
                    title: 'add Booking Room Error!',
                    text: err.error.message,
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                });
            },
        });
    }
    onEditDetail(element: any): void {
        this.roomService.getRoomDetail(element.roomNo).subscribe({
            next: (res) => {
                this.switchMode('edit');
                this.AddRoomClassApplied = true;
                this.RoomSettingClassApplied = false;
                this.roomDetail = this.mapToRoomDto(res.data);
                this.mapApiDataToFiles(this.roomDetail.files);
              this.FacilitiesSelected =  this.roomDetail.facilities .split(',').map(item => item.trim());
                this.editRoomForm.patchValue({
                    RoomName:this.roomDetail.roomName,
                    RoomLocation: this.roomDetail.roomLocation,
                    RoomFloor: this.roomDetail.roomFloor,
                    SeatCount: this.roomDetail.seatCount,
                    Facilities: this.FacilitiesSelected ,
                    Remark:  this.roomDetail.remark,
                    Status: !!this.roomDetail.status
                });
                
                //selectedImg
            },
            error: (err) => {
                console.log('Error Received Response:' + err.error.message);
                Swal.fire({
                    position: 'top-end',
                    title: 'add Booking Room Error!',
                    text: err.error.message,
                    icon: 'error',
                    confirmButtonText: 'ตกลง',
                });
            },
        });
    }

    onDeleteRoom(roomId: number): void {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this room?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                this.roomService.deleteRoom(roomId).subscribe({
                    next: (message) => {
                        Swal.fire('Deleted!', message, 'success'); // แสดงข้อความความสำเร็จ
                        this.loadAllRoom();
                        this.utilityService.triggerRefresh();                       
                       
                    },
                    error: (err) => {
                        console.error('Error while deleting room:', err);
                        Swal.fire('Error!', 'An error occurred while deleting the room.', 'error');
                    },
                });
            }
        });
    }   

    onSubmit() {
        if (this.addRoomForm.valid) {
            this.RoomSpinner.show();
         
            const formData = new FormData();
            const facilitiesValue = this.Facilities.value
                ? this.Facilities.value
                : [];

            const facilitiesString = Object.entries(facilitiesValue)
                .map(([key, value]) => `${value}`) // ดึงค่า value และแปลงเป็น string
                .join(', '); // รวมค่าเป็น string เดียว โดยใช้คอมม่าและช่องว่างคั่น

            formData.append('RoomName', this.addRoomForm.value.RoomName);
            formData.append(
                'RoomLocation',
                this.addRoomForm.value.RoomLocation
            );
            formData.append('RoomFloor', this.addRoomForm.value.RoomFloor);
            formData.append('SeatCount', this.addRoomForm.value.SeatCount);
            formData.append('Facilities', facilitiesString || '');
            formData.append('Remark', this.addRoomForm.value.Remark);
            this.selectedImg.forEach((file, index) => {
                formData.append('Files', file);
            });
            formData.append('RoomType', this.addRoomForm.value.RoomType);
            formData.append('Status', this.addRoomForm.value.Status);
            console.log('status : '+this.addRoomForm.value.Status);
            formData.append('User', this.addRoomForm.value.Remark);
            this.roomService.addNewRoom(formData).subscribe({
                next: (res) => {
                    this.RoomSpinner.hide();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'Room has been Added',
                        showConfirmButton: false,
                        timer: 2500,
                    }).then(() => {
                       
                        this.loadAllRoom();
                        this.utilityService.triggerRefresh();                       
                        
                        this.toggleRoomAddClass();  // ปิดฟอร์ม 
                        this.clearAddRoomForm();
                        // เคลียร์ฟอร์ม
                      
                    });;
                   
                },
                error: (err) => {
                    console.log('Error Received Response:' + err.error.message);
                    Swal.fire({
                        position: 'top-end',
                        title: 'Add Booking Room Error!',
                        text: err.error.message,
                        icon: 'error',
                        confirmButtonText: 'ตกลง',
                    }).then(() => {
                        // ปิดฟอร์ม
                     
                        // เคลียร์ฟอร์ม
                        this.loadAllRoom();
                        this.utilityService.triggerRefresh();
                        
                        this.toggleRoomAddClass();  // ปิดฟอร์ม
                        this.clearAddRoomForm();
                      
                    });
                },
            });

            // this.http
            //     .post('https://localhost:5010/api/Room/add', formData)
            //     .subscribe({
            //         next: (res) =>
            //             console.log('Files uploaded successfully', res),
            //         error: (err) => console.error('File upload error', err),
            //     });
        }
    }
    onEditSubmit() {
      if (this.editRoomForm.valid) {
        this.RoomSpinner.show();
          const formData = new FormData();
          const facilitiesValue = this.editRoomForm.value.Facilities
              ? this.Facilities.value
              : [];
          const selectedFacilities = this.editRoomForm.get('Facilities')?.value;
        //   const facilitiesString = Object.entries(facilitiesValue)
        //       .map(([key, value]) => `${value}`) // ดึงค่า value และแปลงเป็น string
        //       .join(', '); // รวมค่าเป็น string เดียว โดยใช้คอมม่าและช่องว่างคั่น
        
        formData.append('RoomNo',   this.roomDetail.id.toString() );
          formData.append('RoomName', this.editRoomForm.value.RoomName);
          formData.append(
              'RoomLocation',
              this.editRoomForm.value.RoomLocation
          );
          formData.append('RoomFloor', this.editRoomForm.value.RoomFloor);
          formData.append('SeatCount', this.editRoomForm.value.SeatCount);
          formData.append('Facilities', selectedFacilities.toString() || '');
          formData.append('Remark', this.editRoomForm.value.Remark);
          this.selectedImg.forEach((file, index) => {
              formData.append('Files', file);
          });
          formData.append('Status', this.editRoomForm.value.Status);
          formData.append('User', this.editRoomForm.value.Remark);
          this.roomService.editRoom(formData).subscribe({
              next: (res) => {
                  this.AddRoomClassApplied = false;
                  this.RoomSpinner.hide();
                  this.utilityService.triggerRefresh();                       
                       
                  Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Room has been Update',
                      showConfirmButton: false,
                      timer: 2500,
                  });
                  this.loadAllRoom();
                  
                  this.RoomSettingClassApplied = true;
              },
              error: (err) => {
                this.RoomSpinner.hide();
                  Swal.fire({
                      position: 'top-end',
                      title: 'Update Booking Room Error!',
                      text: err.error.message,
                      icon: 'error',
                      confirmButtonText: 'ตกลง',
                  });
              },
          });

          // this.http
          //     .post('https://localhost:5010/api/Room/add', formData)
          //     .subscribe({
          //         next: (res) =>
          //             console.log('Files uploaded successfully', res),
          //         error: (err) => console.error('File upload error', err),
          //     });
      }
  }
  get selectedFacilities(): string[] {
    return this.editRoomForm.get('Facilities')?.value || [];
  }
    // ฟังก์ชันเปลี่ยนโหมด
    switchMode(newMode: 'add' | 'edit' | 'view'): void {
        this.mode = newMode;

        if (newMode === 'edit') {
        }
    }
    mapToRoomDto(data: any): roomDto {
        return {
            id: data.id,
            roomName: data.roomName,
            roomLocation: data.roomLocation,
            roomFloor: data.roomFloor,
            seatCount: data.seatCount,
            facilities: data.facilities,
            status: data.status,
            remark: data.remark,
            createdBy: data.createdBy,
            createdDate: new Date(data.createdDate),
            modifiedBy: data.modifiedBy,
            modifiedDate: new Date(data.modifiedDate),
            files: data.files || [],
        };
    }


    toggleRoomEditClass() {
        this.AddRoomClassApplied = !this.AddRoomClassApplied;
      
    }

    toggleRoomAddClass(): void {
        this.AddRoomClassApplied = !this.AddRoomClassApplied;
        this.RoomSettingClassApplied = !this.RoomSettingClassApplied;
    }
    toggleRoomSettingClass(): void {
        this.RoomSettingClassApplied = !this.RoomSettingClassApplied;
        // this.eventService.sendEvent('',false ,true); // ปิด openRoomSetting เปิดปุ่ม add
    }

    roomSettingSubmit(): void {}
}

export interface PeriodicElement {
    roomNo: string;
    roomImg: { img: string; name: string }[]; // ปรับให้เป็น array ของ object
    roomName: string; // หรือ any หากต้องการ
    roomLocation: string;
    seatCount: string;
    facilities: string;
    status: { rejected: string; confirmed?: string; pending?: string };
    action: { view: string; delete: string; edit: string };
};

