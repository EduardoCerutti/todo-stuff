export type Todo = {
  id: number
  todo: string
  completed: boolean
  userId: number
}

export type Todos = {
  todos: Todo[]
  skip: number
  limit: number
  total: number
}
