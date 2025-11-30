import { updateTodo } from '@/lib/api/updateTodo'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['todo', data.id] })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })
}
