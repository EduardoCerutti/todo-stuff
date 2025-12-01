import { deleteTodo } from '@/lib/api/deleteTodo'
import { Todos } from '@/types/todo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { removeTodoFromCache } from '@/lib/storage'

export function useDeleteTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteTodo(id),
    onSuccess: (deletedTodo) => {
      removeTodoFromCache(deletedTodo.id)

      queryClient.setQueriesData<Todos>(
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
