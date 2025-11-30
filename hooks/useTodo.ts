import { getTodo } from '@/lib/api/getTodo'
import { useQuery } from '@tanstack/react-query'

export function useTodo(id: number) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => getTodo(id),
    enabled: !!id,
  })
}
