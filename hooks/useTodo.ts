import { getTodo } from '@/lib/api/getTodo'
import { useQuery } from '@tanstack/react-query'
import { findTodoInCache } from '@/lib/storage'

export function useTodo(id: number) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: async () => {
      const cachedTodo = findTodoInCache(id)
      if (cachedTodo) {
        return cachedTodo
      }

      return getTodo(id)
    },
    enabled: !!id,
  })
}
