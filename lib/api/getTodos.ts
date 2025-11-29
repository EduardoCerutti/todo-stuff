import axios from '@/lib/api/axios'
import { Todo } from '@/types/todo'

export async function getTodos({
  skip = 0,
  limit = 9,
}: {
  skip?: number
  limit?: number
}): Promise<{
  todos: Todo[]
  skip: number
  limit: number
  total: number
}> {
  const response = await axios.get('/todos', {
    params: { skip, limit },
  })

  return response.data
}
