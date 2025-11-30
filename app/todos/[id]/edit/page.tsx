'use client'

import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { useTodo } from '@/hooks/useTodo'
import { useUpdateTodo } from '@/hooks/useUpdateTodo'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'

const editTodoSchema = z.object({
  todo: z.string().min(1, 'Todo text is required'),
  completed: z.boolean(),
})

type EditTodoFormValues = z.infer<typeof editTodoSchema>

export default function EditTodoPage() {
  const router = useRouter()
  const params = useParams()
  const todoId = Number(params.id)

  const { data: todo, isLoading } = useTodo(todoId)
  const updateTodoMutation = useUpdateTodo()

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
      router.push(`/todos/${todoId}`)
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Todo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-28 w-full" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-28" />
            </div>
            <div className="flex justify-end gap-2">
              <Skeleton className="h-9 w-18" />
              <Skeleton className="h-9 w-30" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/todos/${todoId}`)}
          >
            <ArrowLeft />
          </Button>
          <CardTitle className="text-2xl font-bold">Edit Todo</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="todo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your todo task..."
                        className="min-h-32"
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
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="cursor-pointer"
                      />
                    </FormControl>
                    <div>
                      <FormLabel>Completed</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/todos/${todoId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateTodoMutation.isPending}>
                  {updateTodoMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
