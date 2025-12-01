'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodos } from '@/hooks/useTodos'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { TodosPagination } from '@/components/TodosPagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowLeftFromLine, Ellipsis, Plus } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { ErrorDialog } from '@/components/ErrorDialog'

function TodosContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const limit = Number(searchParams.get('limit') ?? 9)
  const skip = Number(searchParams.get('skip') ?? 0)

  const { data, isLoading, error, isError } = useTodos({ limit, skip })

  const currentPage = Math.floor(skip / limit) + 1
  const totalPages = data?.total ? Math.ceil(data.total / limit) : 1

  const [itemsPerPage, setItemsPerPage] = useState(limit)

  function onChangeItemsPerpage(newValue: string) {
    setItemsPerPage(Number(newValue))

    const urlParams = new URLSearchParams(searchParams)
    urlParams.set('limit', newValue)
    urlParams.set('skip', '0')

    router.push(`?${urlParams.toString()}`)
  }

  function onPageChange(page: number) {
    const newSkip = (page - 1) * limit
    const urlParams = new URLSearchParams(searchParams)
    urlParams.set('skip', newSkip.toString())

    router.push(`?${urlParams.toString()}`)
  }

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Lax;'
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl font-bold">Todos</CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={buttonVariants({ variant: 'ghost' })}
              >
                <Ellipsis />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <ArrowLeftFromLine />
                    Logout
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push('/todos/create')}
                  >
                    <Plus />
                    Add todo
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex gap-2">
            <Label htmlFor="items-per-page">Items per page</Label>
            <Input
              id="items-per-page"
              type="number"
              className="w-16"
              value={itemsPerPage}
              onChange={(e) => onChangeItemsPerpage(e.target.value)}
            />
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

        <CardContent className="flex flex-col gap-4">
          {isLoading || isError
            ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-muted/40 p-4"
                >
                  <Skeleton className="h-5 w-[70%]" />
                  <Skeleton className="h-5 w-5 rounded-sm" />
                </div>
              ))
            : data?.todos.map((item) => {
                const currentUrl = `/todos${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
                return (
                  <div
                    key={item.id}
                    className="flex items-center cursor-pointer justify-between rounded-lg border bg-muted/40 p-4 hover:bg-muted/60 transition-colors"
                    onClick={() =>
                      router.push(
                        `/todos/${item.id}?returnTo=${encodeURIComponent(currentUrl)}`
                      )
                    }
                  >
                    <p>{item.todo}</p>
                    <Checkbox
                      id={`toggle-${item.id}`}
                      checked={item.completed}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )
              })}

          <TodosPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={isLoading}
            isError={isError}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default function TodosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Todos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border bg-muted/40 p-4"
                  >
                    <Skeleton className="h-5 w-[70%]" />
                    <Skeleton className="h-5 w-5 rounded-sm" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <TodosContent />
    </Suspense>
  )
}
