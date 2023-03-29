import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "https://onlinelibraryapi.onrender.com/"
})
export default axiosInstance;