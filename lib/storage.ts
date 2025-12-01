import { Todos } from '@/types/todo'

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
