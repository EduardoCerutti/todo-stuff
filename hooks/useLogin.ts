import { login } from '@/lib/api/login'
import { storeLoginData } from '@/lib/storage/auth'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string
      password: string
    }) => login(username, password),
    onSuccess: (data) => {
      storeLoginData(data)
    },
  })
}
