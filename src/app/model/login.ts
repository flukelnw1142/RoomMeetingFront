export interface LoginRequest {
    Username?: string
    Password?: string
}
export interface LoginResponse {
    token: string
    empId:string
    userNameTh :string
    userNameEn :string
    department :string
    isAdmin : boolean


    
}