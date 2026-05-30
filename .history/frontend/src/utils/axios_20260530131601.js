import axios from "axios";

const instance = axios.create({
  baseURL: "https://newfurno.onrender.com",
  withCredentials: true, 
});
export default instance;