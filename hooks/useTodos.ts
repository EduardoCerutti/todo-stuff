import { getTodos } from '@/lib/api/getTodos'
import { useQuery } from '@tanstack/react-query'
import { getTodosCache, setTodosCache } from '@/lib/storage/todo'

export function useTodos({ skip = 0, limit = 10 }) {
  return useQuery({
    queryKey: ['todos', skip, limit],
    queryFn: async () => {
      const cachedData = getTodosCache(skip, limit)
      if (cachedData) {
        return cachedData
      }

      const data = await getTodos({ skip, limit })

      setTodosCache(skip, limit, data)

      return data
    },
  })
}
