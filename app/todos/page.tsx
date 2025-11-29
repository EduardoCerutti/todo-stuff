'use client'

import { CheckSquare } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodos } from '@/hooks/useTodos'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from '@/components/ui/label'

export default function TodosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const limit = Number(searchParams.get('limit') ?? 9)
  const skip = Number(searchParams.get('skip') ?? 0)

  const { data, isLoading, error } = useTodos({ limit, skip })

  const [itemsPerPage, setItemsPerPage] = useState(limit)

  function onChangeItemsPerpage(newValue: string) {
    setItemsPerPage(Number(newValue))

    const urlParams = new URLSearchParams(searchParams)
    urlParams.set('limit', newValue)

    router.push(`?${urlParams.toString()}`)
  }

  console.log(data)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-xl">
        <CardHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between w-full">
            <CardTitle className="text-2xl font-bold">Todos</CardTitle>
            <CheckSquare className="text-primary size-8" />
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
        </CardContent>
      </Card>
    </div>
  )
}
