import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock PostHog
vi.mock('posthog-js', () => ({
  default: {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn()
  }
}))

vi.mock('posthog-js/react', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
  usePostHog: () => ({
    capture: vi.fn(),
    identify: vi.fn(),
    reset: vi.fn()
  })
}))

// Mock Vercel Analytics
vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
  Analytics: () => null
}))

// Mock Next.js Third Parties
vi.mock('@next/third-parties/google', () => ({
  GoogleAnalytics: () => null
}))

// Mock window.gtag
Object.defineProperty(window, 'gtag', {
  value: vi.fn(),
  writable: true
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(cb, 0)
  return 1
})

global.cancelAnimationFrame = vi.fn() 