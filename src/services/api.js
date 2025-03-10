import axios from "axios";

const API_GATEWAY_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

export const googleLogin = () => {
  return new Promise((resolve, reject) => {
    try {
      const newTab = window.open(
        `${API_GATEWAY_URL}/auth/google-login`,
        "_blank"
      );
      const handleMessage = (event) => {
        if (event.origin !== import.meta.env.VITE_BACKEND_AUTH_URL) return;

        const { message } = event.data;

        if (message === "loginsuccessfull") {
          resolve();

          window.removeEventListener("message", handleMessage);
          if (newTab && !newTab.closed) {
            newTab.close();
          }
        } else {
          reject(new Error("Invalid message received from popup"));
        }
      };
      window.addEventListener("message", handleMessage);
      window.location.reload();
    } catch (error) {
      console.error("Google Login Error:", error.message);
      reject(error);
    }
  });
};


export const logout = async () => {
  try {
    console.log("Redirecting to Google OAuth2 login...");
    window.location.href = `${API_GATEWAY_URL}/auth/logout`;
  } catch (error) {
    console.error("Google Logout Error:", error.message);
  }
};

export default api;