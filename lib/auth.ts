import { User } from '@/types/user'

export function storeLoginData(loginData: User) {
  const maxAge = 7 * 24 * 60 * 60
  const isSecure = process.env.NODE_ENV === 'production'
  const secureFlag = isSecure ? '; Secure' : ''

  document.cookie = `auth-token=${loginData.accessToken}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`

  document.cookie = `refresh-token=${loginData.refreshToken}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`

  const userInfo = {
    id: loginData.id,
    username: loginData.username,
    email: loginData.email,
    firstName: loginData.firstName,
    lastName: loginData.lastName,
    gender: loginData.gender,
    image: loginData.image,
  }
  localStorage.setItem('user', JSON.stringify(userInfo))
}

export function getUserInfo(): Omit<
  User,
  'accessToken' | 'refreshToken'
> | null {
  if (typeof window === 'undefined') return null

  const userStr = localStorage.getItem('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function clearLoginData() {
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  document.cookie =
    'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

  localStorage.removeItem('user')
}
