'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodo } from '@/hooks/useTodo'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Edit } from 'lucide-react'

export default function TodoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const todoId = Number(params.id)

  const { data: todo, isLoading, error } = useTodo(todoId)

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-xl">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">
              Error loading todo. Please try again.
            </p>
            <div className="mt-4 flex justify-center">
              <Button variant="outline" onClick={() => router.push('/todos')}>
                Back to Todos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/todos')}
            >
              <ArrowLeft />
            </Button>
            <CardTitle className="text-2xl font-bold">Todo Details</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {isLoading ? (
            <>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-8 w-full" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-14" />
                <Skeleton className="h-6 w-6" />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Skeleton className="h-9 w-18" />
                <Skeleton className="h-9 w-20" />
              </div>
            </>
          ) : todo ? (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Task
                </label>
                <p className="text-lg">{todo.todo}</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`todo-status-${todo.id}`}
                    checked={todo.completed}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <label htmlFor={`todo-status-${todo.id}`} className="text-sm">
                    {todo.completed ? 'Completed' : 'Incomplete'}
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Todo ID
                </label>
                <p className="text-sm text-muted-foreground">#{todo.id}</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => router.push('/todos')}>
                  Back
                </Button>
                <Button onClick={() => router.push(`/todos/${todo.id}/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
