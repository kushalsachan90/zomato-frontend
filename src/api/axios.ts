import axios from "axios";
import { authService } from "../main";

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {

   
    const originalRequest = error.config;
if (error.response?.status === 401 && error.response?.data?.message === "Refresh token expired") {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
  return Promise.reject(error);
}

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
          console.log("refresh start");
        const refreshToken =
          localStorage.getItem("refreshToken");
   
        const { data } = await api.post(
          `${authService}/api/authroute/refresh`,
          { refreshToken }
        );
  console.log("refresh success", data);
        localStorage.setItem(
          "token",
          data.accessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;
console.log("retrying original request");
        return api(originalRequest);
      } catch (err:any) {
        
        // localStorage.removeItem("refreshToken");
        //     localStorage.removeItem("token")
        // window.location.href = "/login";
       console.log("FULL ERROR", err);
  console.log("MESSAGE", err.message);
  console.log("CODE", err.code);
  console.log("RESPONSE", err.response);
  console.log("CONFIG", err.config);

       console.log(err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;