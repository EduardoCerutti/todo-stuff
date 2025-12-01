import { updateTodo } from '@/lib/api/updateTodo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Todo, Todos } from '@/types/todo'
import { updateTodoInCache } from '@/lib/storage'

export function useUpdateTodo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: { todo?: string; completed?: boolean }
    }) => updateTodo(id, data),
    onSuccess: (updatedTodo) => {
      updateTodoInCache(updatedTodo)

      queryClient.setQueryData<Todo>(['todo', updatedTodo.id], updatedTodo)

      queryClient.setQueriesData<Todos>(
        {
          predicate: (query) =>
            Array.isArray(query.queryKey) && query.queryKey[0] === 'todos',
        },
        (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            todos: oldData.todos.map((todo) =>
              todo.id === updatedTodo.id ? updatedTodo : todo
            ),
          }
        }
      )
    },
  })
}
