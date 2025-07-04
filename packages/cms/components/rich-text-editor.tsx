'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { EditorOptions, EditorState } from '../lib/types'

interface RichTextEditorProps {
  content?: string
  onChange?: (content: string) => void
  options?: EditorOptions
  className?: string
  readOnly?: boolean
}

export function RichTextEditor({
  content = '',
  onChange,
  options = {},
  className = '',
  readOnly = false
}: RichTextEditorProps) {
  const [editorState, setEditorState] = useState<EditorState>({
    content: '',
    isLoading: false,
    hasUnsavedChanges: false,
    wordCount: 0,
    characterCount: 0,
    readingTime: 0
  })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: options.placeholder || 'Start writing...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML()
      const textContent = editor.getText()
      const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length
      const characterCount = textContent.length
      const readingTime = Math.ceil(wordCount / 200) // 200 WPM average

      setEditorState(prev => ({
        ...prev,
        content: newContent,
        hasUnsavedChanges: true,
        wordCount,
        characterCount,
        readingTime
      }))

      onChange?.(newContent)
    },
  })

  // Auto-save functionality
  useEffect(() => {
    if (!options.autosave || !editor) return

    const interval = setInterval(() => {
      if (editorState.hasUnsavedChanges) {
        // Trigger save (this would typically call an API)
        setEditorState(prev => ({ ...prev, hasUnsavedChanges: false }))
      }
    }, (options.autosaveInterval || 30) * 1000)

    return () => clearInterval(interval)
  }, [editor, editorState.hasUnsavedChanges, options.autosave, options.autosaveInterval])

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return (
      <div className={`border rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="border-b bg-gray-50 p-2">
          <div className="flex flex-wrap gap-1">
            {/* Text Formatting */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              icon={<Bold className="w-4 h-4" />}
              tooltip="Bold"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              icon={<Italic className="w-4 h-4" />}
              tooltip="Italic"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              icon={<Strikethrough className="w-4 h-4" />}
              tooltip="Strikethrough"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              icon={<Code className="w-4 h-4" />}
              tooltip="Inline Code"
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Headings */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              icon={<Heading1 className="w-4 h-4" />}
              tooltip="Heading 1"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              icon={<Heading2 className="w-4 h-4" />}
              tooltip="Heading 2"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              icon={<Heading3 className="w-4 h-4" />}
              tooltip="Heading 3"
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Lists */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              icon={<List className="w-4 h-4" />}
              tooltip="Bullet List"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              icon={<ListOrdered className="w-4 h-4" />}
              tooltip="Numbered List"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              icon={<Quote className="w-4 h-4" />}
              tooltip="Quote"
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Links and Images */}
            <ToolbarButton
              onClick={setLink}
              isActive={editor.isActive('link')}
              icon={<LinkIcon className="w-4 h-4" />}
              tooltip="Add Link"
            />
            <ToolbarButton
              onClick={addImage}
              icon={<ImageIcon className="w-4 h-4" />}
              tooltip="Add Image"
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Undo/Redo */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              icon={<Undo className="w-4 h-4" />}
              tooltip="Undo"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              icon={<Redo className="w-4 h-4" />}
              tooltip="Redo"
            />
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none p-4 min-h-[300px] focus:outline-none"
        />
        
        {/* Status indicators */}
        {editorState.hasUnsavedChanges && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
            Unsaved changes
          </div>
        )}
      </div>

      {/* Footer with stats */}
      <div className="border-t bg-gray-50 px-4 py-2 text-xs text-gray-600 flex justify-between">
        <div className="flex space-x-4">
          <span>{editorState.wordCount} words</span>
          <span>{editorState.characterCount} characters</span>
          <span>{editorState.readingTime} min read</span>
        </div>
        {options.autosave && (
          <div className="text-green-600">
            Auto-save enabled
          </div>
        )}
      </div>
    </div>
  )
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  icon: React.ReactNode
  tooltip: string
}

function ToolbarButton({ 
  onClick, 
  isActive = false, 
  disabled = false, 
  icon, 
  tooltip 
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`
        p-2 rounded transition-colors
        ${isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'hover:bg-gray-100 text-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {icon}
    </button>
  )
}

// Export editor utilities
export const useRichTextEditor = (initialContent = '') => {
  const [content, setContent] = useState(initialContent)
  const [stats, setStats] = useState({
    wordCount: 0,
    characterCount: 0,
    readingTime: 0
  })

  const updateStats = useCallback((newContent: string) => {
    const textContent = newContent.replace(/<[^>]*>/g, '') // Strip HTML
    const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 0).length
    const characterCount = textContent.length
    const readingTime = Math.ceil(wordCount / 200)

    setStats({ wordCount, characterCount, readingTime })
  }, [])

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    updateStats(newContent)
  }, [updateStats])

  useEffect(() => {
    updateStats(initialContent)
  }, [initialContent, updateStats])

  return {
    content,
    stats,
    setContent: handleContentChange
  }
} 