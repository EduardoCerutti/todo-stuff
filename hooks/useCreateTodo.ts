import { createTodo } from '@/lib/api/createTodo'
import { Todos } from '@/types/todo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserInfo } from '@/lib/auth'

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { todo: string; completed: boolean }) => {
      const userInfo = getUserInfo()
      if (!userInfo) {
        throw new Error('User not authenticated')
      }

      return createTodo({
        ...data,
        userId: userInfo.id,
      })
    },
    onSuccess: (newTodo) => {
      queryClient.setQueriesData<Todos>(
        {
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey[0] === 'todos',
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            todos: [newTodo, ...oldData.todos],
          }
        }
      )
    },
  })
}
