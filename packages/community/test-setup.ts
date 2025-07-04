import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock fetch globally
global.fetch = vi.fn()

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock community service
vi.mock('./lib/community-service', () => ({
  communityService: {
    getForums: vi.fn(),
    getForum: vi.fn(),
    createForum: vi.fn(),
    updateForum: vi.fn(),
    deleteForum: vi.fn(),
    getTopics: vi.fn(),
    getTopic: vi.fn(),
    createTopic: vi.fn(),
    updateTopic: vi.fn(),
    deleteTopic: vi.fn(),
    getComments: vi.fn(),
    getComment: vi.fn(),
    createComment: vi.fn(),
    updateComment: vi.fn(),
    deleteComment: vi.fn(),
    vote: vi.fn(),
    getVoteStats: vi.fn(),
    getUser: vi.fn(),
    getUserActivity: vi.fn(),
    getUserBadges: vi.fn(),
    getBadges: vi.fn(),
    followUser: vi.fn(),
    unfollowUser: vi.fn(),
    getFollowers: vi.fn(),
    getFollowing: vi.fn(),
    search: vi.fn(),
    getNotifications: vi.fn(),
    markNotificationRead: vi.fn(),
  },
  CommunityService: vi.fn(),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    form: 'form',
    input: 'input',
    textarea: 'textarea',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
}))

// Mock date-fns
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(() => '2 hours ago'),
  format: vi.fn(() => 'Jan 2023'),
  isAfter: vi.fn(() => false),
  isBefore: vi.fn(() => true),
  addDays: vi.fn(() => new Date()),
  subDays: vi.fn(() => new Date()),
}))

// Mock lodash
vi.mock('lodash', () => ({
  debounce: vi.fn((fn) => fn),
  throttle: vi.fn((fn) => fn),
  orderBy: vi.fn((arr) => arr),
  groupBy: vi.fn(() => ({})),
  uniqBy: vi.fn((arr) => arr),
  isEmpty: vi.fn(() => false),
}))

// Setup console mocks
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
  log: vi.fn(),
} 