import { vi } from 'vitest'

// Mock dependencies that may not be available in test environment
vi.mock('rss-parser', () => ({
  default: vi.fn().mockImplementation(() => ({
    parseURL: vi.fn().mockResolvedValue({
      items: []
    })
  }))
}))

vi.mock('cheerio', () => ({
  load: vi.fn().mockReturnValue({
    text: vi.fn().mockReturnValue(''),
    length: 0,
    each: vi.fn(),
    attr: vi.fn(),
    prop: vi.fn()
  })
}))

vi.mock('turndown', () => ({
  default: vi.fn().mockImplementation(() => ({
    turndown: vi.fn().mockReturnValue('')
  }))
}))

vi.mock('sanitize-html', () => ({
  default: vi.fn().mockImplementation((html) => html)
}))

vi.mock('reading-time', () => ({
  default: vi.fn().mockReturnValue({
    minutes: 1,
    words: 200,
    text: '1 min read'
  })
}))

vi.mock('slug', () => ({
  default: vi.fn().mockImplementation((text) => 
    text.toLowerCase().replace(/\s+/g, '-')
  )
}))

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(),
  EditorContent: vi.fn().mockReturnValue(null)
}))

vi.mock('@tiptap/starter-kit', () => ({
  default: {
    configure: vi.fn().mockReturnValue({})
  }
}))

vi.mock('@tiptap/extension-placeholder', () => ({
  default: {
    configure: vi.fn().mockReturnValue({})
  }
}))

vi.mock('@tiptap/extension-link', () => ({
  default: {
    configure: vi.fn().mockReturnValue({})
  }
}))

vi.mock('@tiptap/extension-image', () => ({
  default: {
    configure: vi.fn().mockReturnValue({})
  }
}))

vi.mock('lucide-react', () => ({
  Bold: vi.fn().mockReturnValue(null),
  Italic: vi.fn().mockReturnValue(null),
  Underline: vi.fn().mockReturnValue(null),
  Strikethrough: vi.fn().mockReturnValue(null),
  Code: vi.fn().mockReturnValue(null),
  Heading1: vi.fn().mockReturnValue(null),
  Heading2: vi.fn().mockReturnValue(null),
  Heading3: vi.fn().mockReturnValue(null),
  List: vi.fn().mockReturnValue(null),
  ListOrdered: vi.fn().mockReturnValue(null),
  Quote: vi.fn().mockReturnValue(null),
  Link: vi.fn().mockReturnValue(null),
  Image: vi.fn().mockReturnValue(null),
  Undo: vi.fn().mockReturnValue(null),
  Redo: vi.fn().mockReturnValue(null),
  Type: vi.fn().mockReturnValue(null),
  AlignLeft: vi.fn().mockReturnValue(null),
  AlignCenter: vi.fn().mockReturnValue(null),
  AlignRight: vi.fn().mockReturnValue(null)
}))

// Global test environment setup
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
  log: vi.fn()
}

// Mock DOM APIs that might be needed
Object.defineProperty(window, 'prompt', {
  value: vi.fn().mockReturnValue('http://example.com'),
  writable: true
}) 