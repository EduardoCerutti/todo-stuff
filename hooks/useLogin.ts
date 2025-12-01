import { login } from '@/lib/api/login'
import { storeLoginData } from '@/lib/storage/auth'
import { clearTodosCache } from '@/lib/storage/todo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useLogin() {
  const queryClient = useQueryClient()

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

      clearTodosCache()
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
