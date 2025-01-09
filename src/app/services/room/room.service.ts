import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { booking, room, monthlyEvent, bookingDetail, roomDto, SearchRoomRequest } from '../../model/dashboard';
const BASE_URL = `${environment.apiBaseUrl}/api`;

@Injectable({
    providedIn: 'root',
})
export class RoomService {
    constructor(private http: HttpClient) { }

    getOptions(isActive: string = "all"): Observable<any[]> {

        return this.http.get<any[]>(`${BASE_URL}/Room/all-room?status=` + isActive);
    }

    getTodayBookings(
        roomId: number
    ): Observable<{ success: boolean; message: string; data: any }> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        console.log('BASE_URL_Room' + BASE_URL);
        return this.http.get<{ success: boolean; message: string; data: any }>(
            `${BASE_URL}/Bookings/get-today-bookings?roomId=` + roomId,
            { headers }
        );
    }

    getAllBookingsByRoom(
        roomId: number
    ): Observable<{ success: boolean; message: string; data: monthlyEvent[] }> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        console.log('BASE_URL_Room' + BASE_URL);
        return this.http.get<{
            success: boolean;
            message: string;
            data: monthlyEvent[];
        }>(`${BASE_URL}/Bookings/get-all-bookings-room?roomId=` + roomId, {
            headers,
        });
    };

    getBookingsRoomDetail(
        roomNo: string
    ): Observable<{ success: boolean; message: string; data: bookingDetail }> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        console.log('BASE_URL_Room' + BASE_URL);
        return this.http.get<{
            success: boolean;
            message: string;
            data: bookingDetail;
        }>(`${BASE_URL}/Bookings/get-bookings-room-detail?roomNo=` + roomNo, {
            headers,
        });
    };


    getAllRoom(): Observable<{ success: boolean; message: string; data: roomDto[] }> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        console.log('BASE_URL_Room' + BASE_URL);
        return this.http.get<{
            success: boolean;
            message: string;
            data: roomDto[];
        }>(`${BASE_URL}/Room/get-all-room`, {
            headers,
        });
    };


    deleteRoom(roomId: number): Observable<string> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });

        console.log(`Requesting to delete room with ID: ${roomId}`);

        return this.http
            .delete<{ success: boolean; message: string }>(
                `${BASE_URL}/Room/${roomId}`,
                { headers, observe: 'response' }
            )
            .pipe(
                map((response) => {
                    // ตรวจสอบ StatusCode
                    if (response.status === 204) {
                        return 'Room deleted successfully.';
                    } else if (response.body && !response.body.success) {
                        return response.body.message || 'Failed to delete room.';
                    }
                    return 'Unexpected response from server.';
                }),
                catchError((error) => {
                    // จัดการข้อผิดพลาดตาม StatusCode
                    if (error.status === 404) {
                        return throwError(() => new Error('Room not found.'));
                    } else if (error.status === 500) {
                        return throwError(() => new Error('An error occurred while deleting the room.'));
                    }
                    return throwError(() => new Error('Something went wrong. Please try again.'));
                })
            );
    }

    getRoomDetail(roomId: number): Observable<{ success: boolean; message: string; data: roomDto }> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        console.log('BASE_URL_Room' + BASE_URL);
        return this.http.get<{
            success: boolean;
            message: string;
            data: roomDto;
        }>(`${BASE_URL}/Room/get-room-detail?roomId=` + roomId, {
            headers,
        });
    };

    addBookingRoom(request: booking): Observable<any> {
        const accessToken = localStorage.getItem('auth-key');
        const empId = localStorage.getItem('EmpId');
        if (!accessToken && !empId) {
            console.error('No access token found');
        }
        request.CreatedBy = empId;
        request.BookingBy = empId;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        return this.http.post<booking>(
            `${BASE_URL}/Bookings/add-booking`,
            request,
            { headers }
        );
    }

    addNewBooking(request: Array<{ FieldName: string; FieldValue: string }>): Observable<any> {
        console.log(request);
        
        const accessToken = localStorage.getItem('auth-key');
        if (!accessToken) {
            console.error('No access token found');
            throw new Error('Authentication required');
        }
    
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
    
        return this.http.post<Array<{ FieldName: string; FieldValue: string }>>(
            `${BASE_URL}/RoomBookings/InsertDynamicBooking`,
            request,
            { headers }
        );
    }    

    searchAvaliableRoom(request: SearchRoomRequest): Observable<any> {
        const accessToken = localStorage.getItem('auth-key');
        const empId = localStorage.getItem('EmpId');
        // request.BookingBy = userInfo.
        if (!accessToken && !empId) {
            console.error('No access token found');
            // this.router.navigate(['/authentication']);
            // return;
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        return this.http.post<SearchRoomRequest>(
            `${BASE_URL}/Room/available`,
            request,
            { headers }
        );
    }
    addNewRoom(
        request: FormData
    ): Observable<{ success: boolean; message: string; data: any }> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
        });

        return this.http.post<{ success: boolean; message: string; data: any }>(
            `${BASE_URL}/Room/add`,
            request,
            { headers }
        );
    }

    editRoom(
        request: FormData
    ): Observable<{ success: boolean; message: string; data: any }> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
        });

        return this.http.post<{ success: boolean; message: string; data: any }>(
            `${BASE_URL}/Room/edit`,
            request,
            { headers }
        );
    }

    getAvailableTimeSlots(roomId: number,bookingDate:string): Observable<string[]> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        console.log('BASE_URL_Room' + BASE_URL);
        return this.http.get<string[]>(
            `${BASE_URL}/RoomBookings/GetAvailableTimeSlots?roomId=${roomId}&bookingDate=${bookingDate}`,
            { headers }
        );
    };

    getAvailableTimeRanges(roomId: number,bookingDate:string,startTime:string): Observable<string[]> {
        const accessToken = localStorage.getItem('auth-key');
        const headers = new HttpHeaders({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        });
        console.log('BASE_URL_Room' + BASE_URL);
        return this.http.get<string[]>(
            `${BASE_URL}/RoomBookings/GetAvailableTimeRanges?roomId=${roomId}&bookingDate=${bookingDate}&startTime=${startTime}`,
            { headers }
        );
    };

    GetAllRooms(): Observable<any[]> {
        return this.http.get<any[]>(`${BASE_URL}/RoomsQuery/GetAllRooms`);
    }
}
