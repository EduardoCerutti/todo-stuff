import { deleteTodo } from '@/lib/api/deleteTodo'
import { Todo } from '@/types/todo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteTodo(id),
    onSuccess: (deletedTodo) => {
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
            todos: oldData.todos.filter((todo) => todo.id !== deletedTodo.id),
          }
        }
      )
    },
  })
}
