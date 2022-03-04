import axios from "axios";
const axiosInstance = axios.create({
    baseURL: "https://onlinebookapi.herokuapp.com/"
})
export default axiosInstance;