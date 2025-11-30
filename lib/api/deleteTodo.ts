import axios from '@/lib/api/axios'
import { Todo } from '@/types/todo'

export async function deleteTodo(id: number): Promise<Todo> {
  const response = await axios.delete(`/todos/${id}`)

  return response.data
}
