'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft } from 'lucide-react'
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
import { useCreateTodo } from '@/hooks/useCreateTodo'
import { ErrorDialog } from '@/components/ErrorDialog'
import { useState } from 'react'

const createTodoSchema = z.object({
  todo: z.string().min(1, 'Todo text is required'),
  completed: z.boolean(),
})

type CreateTodoFormValues = z.infer<typeof createTodoSchema>

export default function CreateTodoPage() {
  const router = useRouter()
  const createTodoMutation = useCreateTodo()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<CreateTodoFormValues>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      todo: '',
      completed: false,
    },
  })

  const onSubmit = async (values: CreateTodoFormValues) => {
    try {
      setError(null)
      await createTodoMutation.mutateAsync(values)
      router.push('/todos')
    } catch (error) {
      console.error('Failed to create todo:', error)
      setError(error instanceof Error ? error.message : 'Failed to create todo')
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
              onClick={() => router.push('/todos')}
            >
              <ArrowLeft />
            </Button>

            <CardTitle className="text-2xl font-bold">Create Todo</CardTitle>
          </div>
        </CardHeader>

        {error && (
          <ErrorDialog title="Error.">
            <>
              <p className="text-destructive">{error}</p>

              <div className="flex justify-end w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    setError(null)
                    router.refresh()
                  }}
                >
                  Refresh page
                </Button>
              </div>
            </>
          </ErrorDialog>
        )}

        <CardContent className="flex flex-col gap-6">
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
                          id="todo-status-new"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="cursor-pointer"
                        />
                      </FormControl>

                      <label
                        htmlFor="todo-status-new"
                        className="text-sm cursor-pointer"
                      >
                        {field.value ? 'Completed' : 'Incomplete'}
                      </label>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/todos')}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={createTodoMutation.isPending}>
                  {createTodoMutation.isPending ? 'Creating...' : 'Create Todo'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
