import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:1003",
  withCredentials: true,
})

// Add a request interceptor to add the token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if we're in the browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const { data } = await api.patch("/token/refresh")

        // Store the new token
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token)
        }

        // Update the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.token}`

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
