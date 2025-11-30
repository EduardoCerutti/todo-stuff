import axios from '@/lib/api/axios'
import { User } from '@/types/user'

export async function login(username: string, password: string): Promise<User> {
  const response = await axios.post('/auth/login', {
    username,
    password,
  })

  return response.data
}
