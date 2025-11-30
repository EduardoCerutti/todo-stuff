import axios from '@/lib/api/axios'
import { Login } from '@/types/login'

export async function login(
  username: string,
  password: string
): Promise<Login> {
  const response = await axios.post('/auth/login', {
    username,
    password,
  })

  return response.data
}
