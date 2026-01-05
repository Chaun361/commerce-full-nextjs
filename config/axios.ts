import axios from "axios";
const BASEURL = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: BASEURL,
    headers: { 'Content-Type': 'application/json' }
});

export const axiosPrivate = axios.create({
    baseURL: BASEURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})

export default axiosInstance;