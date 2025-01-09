export interface booking {
    RoomId: number | null; // Nullable number
    BookingNo?: string | null; // Nullable string
    BookingDate?: string| null; // ISO Date string (e.g., "2024-12-11T00:00:00")
    BookingFrom?: string| null; // Time string (e.g., "09:00:00")
    BookingTo?: string| null; // Time string (e.g., "11:00:00")
    BookingBy?: string | null;
    BookingByName?: string | null;
    BookingByContact?: string | null;
    BookingType?: string | null;
    BookingSubject?: string | null;
    BookingDetail?: string | null;
    BookingByEmail?: string | null;
    BookingAttendees?: string | null;
    Remark?: string | null;
    CancelBy: string | null;
    CancelDate: string| null; 
    CreatedBy?: string | null;
    CreatedDate?: string | null; // Nullable ISO Date string
    ModifiedBy?: string | null;
    ModifiedDate?: string | null; // Nullable ISO Date string
    BookingStatus?: string | null;
}
export interface SearchRoomRequest {
  date: string;        // Date เก็บเป็น string
  timeFrom: string;    // TimeFrom เก็บเป็น string
  timeTo: string;      // TimeTo เก็บเป็น string
}
export interface room {
    RoomId?: number | null; 
    RoomName?: string | null; 
    RoomLocation?: string| null;
    RoomFloor?: string| null; 
    SeatCount?: string| null; 
    FileName ?: string| null; 
    
}
export interface monthlyEvent {
    bookingNo:string;
    title: string;
    date: string;
    description: string;
    bookingType: string;
}

export interface bookingDetail {
    bookingNo:string;   
    roomId: string;
    roomName: string;
    roomLocation?: string| null; 
    roomFloor?: string| null; 
    description: string;
    bookingDate: string;    
    bookingFrom?: string| null; 
    bookingTo?: string| null; 
    bookingType?: string | null;
    bookingSubject?: string | null;
    bookingByContact?: string | null;
    bookingBy?: string | null;
    bookingByName?: string | null;
    bookingByMobile?: string | null;
    bookingDepartment?: string | null;
    isOwner?: boolean | null;
  
}

export const defaultBookingDetail: bookingDetail = {
  bookingNo: "",
  roomId: "",
  roomName: "",
  roomLocation: null,
  roomFloor: null,
  description: "",
  bookingDate: "",
  bookingFrom: null,
  bookingTo: null,
  bookingType: null,
  bookingSubject: null,
  bookingByContact: null,
  bookingBy: null,
  bookingByName: null,
  bookingByMobile: null,
  bookingDepartment: null,
};
export interface tFile {
    id: number; // รหัสไฟล์
    roomId: number; // รหัสห้องที่ไฟล์เกี่ยวข้อง
    fileType: string; // ประเภทของไฟล์
    filePath: string; // ที่อยู่ไฟล์
    fileName: string; // ชื่อไฟล์
    roomImg :string; 
    labelText?: string; // ข้อความ label (อาจไม่มีค่า)
    uploadedDate: Date; // วันที่อัพโหลด
    uploadedBy?: string; // ผู้ที่อัพโหลดไฟล์ (อาจไม่มีค่า)
  }

  export interface roomDto {
    id: number; // รหัสห้อง
    roomName: string; // ชื่อห้อง
    roomLocation: string; // ที่ตั้งห้อง
    roomFloor: string; // ชั้นของห้อง
    seatCount: string; // จำนวนที่นั่ง
    facilities: string; // สิ่งอำนวยความสะดวก
    status?: number; // สถานะห้อง (อาจไม่มีค่า)
    remark: string; // หมายเหตุ
    createdBy: string; // ผู้สร้างห้อง
    createdDate: Date; // วันที่สร้างห้อง
    modifiedBy: string; // ผู้ที่แก้ไขห้องล่าสุด
    modifiedDate: Date; // วันที่แก้ไขห้องล่าสุด
    files: tFile[]; // รายการไฟล์ที่เกี่ยวข้องกับห้อง
  }
  
export interface GroupedBookings {
    [roomId: number]: booking[];
  }

  
export interface selectedImages {
  url: string;
  title: string;   
};