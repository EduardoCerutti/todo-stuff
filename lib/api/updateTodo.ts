import axios from '@/lib/api/axios'
import { Todo } from '@/types/todo'

export async function updateTodo(
  id: number,
  data: { todo?: string; completed?: boolean }
): Promise<Todo> {
  const response = await axios.put(`/todos/${id}`, data)

  return response.data
}
