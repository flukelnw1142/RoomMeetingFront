import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';


import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse} from '../../model/login';
import { environment } from '../../../environments/environment'; 


const BASE_URL = `${environment.apiBaseUrl}`;

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  constructor(private http: HttpClient) { }
 // ใช้ baseUrl จาก environment

  // doLogin(request: LoginRequest):Observable<LoginResponse> {
  //   return this.http.post<LoginResponse>(BASE_URL + "/login", request);
  // }

  doLogin(request: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'accept': '*/*',
      'Content-Type': 'application/json'
    });
    
    console.log('BASE_URL'+`${BASE_URL}/login`)
    return this.http.post<LoginResponse>(`${BASE_URL}/login`, request, { headers });
  }


  dashboard(): Observable<any> {
    return this.http.get<any>(BASE_URL + "/dashboard");
  }

//   doRegister(request: SignupRequest):Observable<SignupResponse> {
//     return this.http.post<SignupResponse>(BASE_URL + "/doRegister", request);
//   }
}
