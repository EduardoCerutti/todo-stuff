import { createTodo } from '@/lib/api/createTodo'
import { Todo } from '@/types/todo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { todo: string; completed: boolean; userId: number }) =>
      createTodo(data),
    onSuccess: (newTodo) => {
      queryClient.setQueriesData<{
        todos: Todo[]
        skip: number
        limit: number
        total: number
      }>(
        {
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey[0] === 'todos',
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            todos: [...oldData.todos, newTodo],
          }
        }
      )
    },
  })
}
