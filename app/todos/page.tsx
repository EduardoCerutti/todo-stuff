'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodos } from '@/hooks/useTodos'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function TodosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const limit = Number(searchParams.get('limit') ?? 9)
  const skip = Number(searchParams.get('skip') ?? 0)

  const { data, isLoading, error } = useTodos({ limit, skip })

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

  function getPageNumbers() {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push('ellipsis')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl font-bold">Todos</CardTitle>

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: 'ghost' }),
                  'cursor-pointer'
                )}
              >
                <Ellipsis />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
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

        <CardContent className="flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border bg-muted/40 p-4"
                >
                  <Skeleton className="h-5 w-[70%]" />
                  <Skeleton className="h-5 w-5 rounded-sm" />
                </div>
              ))
            : data?.todos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border bg-muted/40 p-4"
                >
                  <p>{item.todo}</p>
                  <Checkbox
                    id={`toggle-${item.id}`}
                    checked={item.completed}
                    className="cursor-pointer"
                  />
                </div>
              ))}

          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-20" />
            </div>
          ) : totalPages > 1 ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        onPageChange(currentPage - 1)
                      }
                    }}
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => {
                  if (page === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          onPageChange(page)
                        }}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        onPageChange(currentPage + 1)
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
