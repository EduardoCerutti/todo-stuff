import { login } from '@/lib/api/login'
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
  })
}
