import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'
import { clearLoginData } from '@/lib/storage/auth'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('auth-token=')
      )
      if (authCookie) {
        const token = authCookie.split('=')[1]
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (typeof document !== 'undefined') {
            clearLoginData()
            window.location.href = '/login'
          }
          break
        case 403:
          console.error(
            'Forbidden: You do not have permission to access this resource'
          )
          break
        case 404:
          console.error('Not Found: The requested resource was not found')
          break
        case 500:
          console.error('Server Error: Something went wrong on the server')
          break
        default:
          console.error('Request failed:', error.message)
      }
    } else if (error.request) {
      console.error('Network Error: No response received from server')
    } else {
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
