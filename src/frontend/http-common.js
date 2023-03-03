import axios from "axios";

export default axios.create({
    baseURL: "https://cc-backend-fnot.onrender.com/api/v1",
    headers: { "Content-type" : "application/json" },
    withCredentials: true
});