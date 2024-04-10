import axios, { AxiosRequestConfig, RawAxiosRequestHeaders, AxiosResponse } from "axios";
interface postLoginBody {
    email: string,
    password: string
}

interface postUserBody extends postLoginBody {
    name: string,
    age: number,
}

interface userBody {
    _id: string,
    id: string,
    name: string,
    age: number,
    email: string,
    createdAt: Date,
    updatedAt: Date,
}
export const addUser = (data: postUserBody)=>{
    const config: AxiosRequestConfig = {
        headers:{
            Accept: 'Application/json'
        } as RawAxiosRequestHeaders,
        withCredentials: true,
        method: 'POST',
        data,
        url: 'http://localhost:5000/user'
    }

}
export const loginUser = async (data: postLoginBody): Promise<{user: userBody, token: string}> => {
    let config:  AxiosRequestConfig = {
        headers: {
            'Accept': 'applicatoin/json',
        } as RawAxiosRequestHeaders,
        withCredentials: true
    } 
    const response: AxiosResponse<{user: userBody, token: string}, any> = await axios.post('http://localhost:5000/users/login', data, config)
       return response.data; 
}