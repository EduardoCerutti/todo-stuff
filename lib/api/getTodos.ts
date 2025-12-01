import axios from '@/lib/api/axios'
import { Todos } from '@/types/todo'

// I left without emily's data because she has only two registers and I want you
// to test the paginagion with more data
export async function getTodos({
  skip = 0,
  limit = 9,
}: {
  skip?: number
  limit?: number
}): Promise<Todos> {
  const response = await axios.get('/todos', {
    params: { skip, limit },
  })

  return response.data
}
