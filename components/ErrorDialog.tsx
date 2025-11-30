'use client'

import { Terminal } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { ReactNode, useState } from 'react'

export function ErrorDialog({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const [showError, setShowError] = useState(true)

  return (
    <Dialog open={showError} onOpenChange={setShowError}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">{title}</DialogTitle>
        </DialogHeader>

        <Alert variant="destructive">
          <Terminal />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{children}</AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  )
}
