import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}))

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
  },
}))

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
    isAdmin: true,
  }),
}))
