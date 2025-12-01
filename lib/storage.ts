import { Todo, Todos } from '@/types/todo'

function getTodosCacheKey(skip: number, limit: number): string {
  return `todos:${skip}:${limit}`
}

export function getTodosCache(skip: number, limit: number): Todos | null {
  try {
    if (typeof window === 'undefined') {
      return null
    }

    const cacheKey = getTodosCacheKey(skip, limit)
    const cachedData = localStorage.getItem(cacheKey)

    if (!cachedData) {
      return null
    }

    return JSON.parse(cachedData) as Todos
  } catch (error) {
    console.warn('Failed to read todos cache from localStorage:', error)
    return null
  }
}

export function setTodosCache(skip: number, limit: number, data: Todos): void {
  try {
    if (typeof window === 'undefined') {
      return
    }

    const cacheKey = getTodosCacheKey(skip, limit)
    localStorage.setItem(cacheKey, JSON.stringify(data))
  } catch (error) {
    console.warn('Failed to write todos cache to localStorage:', error)
  }
}

export function findTodoInCache(id: number): Todo | null {
  try {
    if (typeof window === 'undefined') {
      return null
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith('todos:')) {
        continue
      }

      try {
        const cachedData = localStorage.getItem(key)
        if (!cachedData) {
          continue
        }

        const todosData = JSON.parse(cachedData) as Todos
        const foundTodo = todosData.todos.find((todo) => todo.id === id)

        if (foundTodo) {
          return foundTodo
        }
      } catch {
        continue
      }
    }

    return null
  } catch (error) {
    console.warn('Failed to search todos cache:', error)
    return null
  }
}

export function removeTodoFromCache(id: number): void {
  try {
    if (typeof window === 'undefined') {
      return
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith('todos:')) {
        continue
      }

      try {
        const cachedData = localStorage.getItem(key)
        if (!cachedData) {
          continue
        }

        const todosData = JSON.parse(cachedData) as Todos
        const filteredTodos = todosData.todos.filter((todo) => todo.id !== id)

        if (filteredTodos.length !== todosData.todos.length) {
          const updatedData: Todos = {
            ...todosData,
            todos: filteredTodos,
          }
          localStorage.setItem(key, JSON.stringify(updatedData))
        }
      } catch {
        continue
      }
    }
  } catch (error) {
    console.warn('Failed to remove todo from cache:', error)
  }
}
