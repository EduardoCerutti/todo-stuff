import axios from '@/lib/api/axios'
import { Todo } from '@/types/todo'

export async function getTodo(id: number): Promise<Todo> {
  const response = await axios.get(`/todos/${id}`)

  return response.data
}
