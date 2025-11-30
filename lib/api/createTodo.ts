import axios from '@/lib/api/axios'
import { Todo } from '@/types/todo'

export async function createTodo(data: {
  todo: string
  completed: boolean
  userId: number
}): Promise<Todo> {
  const response = await axios.post('/todos/add', data)

  return response.data
}
