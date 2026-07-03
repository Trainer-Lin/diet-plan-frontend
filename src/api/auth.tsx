import axiosHelper from './AxiosHelper';

export interface LoginParams{
    username: string;
    password: string;
}

export interface LoginResponse{
    token: string;
    tokenType: string;
}

export const loginAPI = (data: LoginParams)=>{
    return axiosHelper.post<any,LoginResponse>('/auth/login', data);
}
