'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodo } from '@/hooks/useTodo'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateTodo } from '@/hooks/useUpdateTodo'
import { useDeleteTodo } from '@/hooks/useDeleteTodo'
import { useEffect } from 'react'
import { ErrorDialog } from '@/components/ErrorDialog'

const editTodoSchema = z.object({
  todo: z.string().min(1, 'Todo text is required'),
  completed: z.boolean(),
})

type EditTodoFormValues = z.infer<typeof editTodoSchema>

export default function TodoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const todoId = Number(params.id)
  const returnTo = searchParams.get('returnTo') || '/todos'

  const { data: todo, isLoading, error, isError } = useTodo(todoId)
  const updateTodoMutation = useUpdateTodo()
  const deleteTodoMutation = useDeleteTodo()

  const form = useForm<EditTodoFormValues>({
    resolver: zodResolver(editTodoSchema),
    defaultValues: {
      todo: '',
      completed: false,
    },
  })

  useEffect(() => {
    if (todo) {
      form.reset({
        todo: todo.todo,
        completed: todo.completed,
      })
    }
  }, [todo, form])

  const onSubmit = async (values: EditTodoFormValues) => {
    try {
      await updateTodoMutation.mutateAsync({
        id: todoId,
        data: values,
      })
      router.push(returnTo)
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  const onDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return
    }
    try {
      await deleteTodoMutation.mutateAsync({ id: todoId })
      router.push(returnTo)
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(returnTo)}
            >
              <ArrowLeft />
            </Button>

            <CardTitle className="text-2xl font-bold">Todo Details</CardTitle>
          </div>
        </CardHeader>

        {isError && (
          <ErrorDialog title="Error.">
            <>
              <p className="text-destructive">{error?.message}</p>

              <div className="flex justify-end w-full">
                <Button variant="outline" onClick={() => router.refresh()}>
                  Refresh page
                </Button>
              </div>
            </>
          </ErrorDialog>
        )}

        <CardContent className="flex flex-col gap-6">
          {isLoading || isError ? (
            <>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-28 w-full" />
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
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-18" />
                <Skeleton className="h-9 w-30" />
              </div>
            </>
          ) : todo ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="todo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your todo task..."
                          className="min-h-32 text-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="completed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>

                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            id={`todo-status-${todo.id}`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="cursor-pointer"
                          />
                        </FormControl>

                        <label
                          htmlFor={`todo-status-${todo.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {field.value ? 'Completed' : 'Incomplete'}
                        </label>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Todo ID
                  </label>
                  <p className="text-sm text-muted-foreground">#{todo.id}</p>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={onDelete}
                    disabled={deleteTodoMutation.isPending}
                  >
                    <Trash2 />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push(returnTo)}
                  >
                    Back
                  </Button>

                  <Button type="submit" disabled={updateTodoMutation.isPending}>
                    {updateTodoMutation.isPending
                      ? 'Saving...'
                      : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
