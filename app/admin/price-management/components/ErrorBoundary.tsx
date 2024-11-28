'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent } from '@/app/components/ui'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Price Management Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Card className="border-destructive">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-destructive mb-2">
                Something went wrong
              </h3>
              <p className="text-sm text-muted-foreground">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <button
                className="mt-4 text-sm text-primary hover:underline"
                onClick={() => this.setState({ hasError: false })}
              >
                Try again
              </button>
            </CardContent>
          </Card>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
