import { getTodos } from '@/lib/api/getTodos'
import { useQuery } from '@tanstack/react-query'

export function useTodos({ skip = 0, limit = 10 }) {
  return useQuery({
    queryKey: ['todos', skip, limit],
    queryFn: () => getTodos({ skip, limit }),
  })
}
