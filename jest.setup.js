import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}))

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}))

// Mock AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { uid: 'test-uid' },
    isAdmin: true,
  }),
}))
