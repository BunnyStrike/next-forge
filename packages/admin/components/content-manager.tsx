'use client'

import React, { useState } from 'react'
import { Edit, Save, Plus, Trash2 } from 'lucide-react'
import { Button } from '@repo/design-system/components/ui/button'
import { Input } from '@repo/design-system/components/ui/input'
import { Label } from '@repo/design-system/components/ui/label'
import { Textarea } from '@repo/design-system/components/ui/textarea'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/design-system/components/ui/card'
import { Badge } from '@repo/design-system/components/ui/badge'
import { useAdmin } from '../hooks/use-admin'
import type { AdminContent } from '../lib/types'

export const ContentManager = () => {
  const { selectedContent, setSelectedContent, updateContent } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<AdminContent>>({})

  // Mock content data - replace with actual data fetching
  const mockContent: AdminContent[] = [
    {
      id: '1',
      type: 'text',
      label: 'Page Title',
      value: 'Welcome to Our Platform',
    },
    {
      id: '2',
      type: 'rich-text',
      label: 'Main Description',
      value: 'This is the main content area for your page.',
    },
    {
      id: '3',
      type: 'button',
      label: 'CTA Button',
      value: 'Get Started',
      metadata: { href: '/signup', variant: 'primary' },
    },
  ]

  const handleEdit = (content: AdminContent) => {
    setSelectedContent(content)
    setEditForm(content)
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (selectedContent && editForm) {
      await updateContent(selectedContent.id, editForm)
      setIsEditing(false)
      setSelectedContent(null)
      setEditForm({})
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedContent(null)
    setEditForm({})
  }

  const renderContentEditor = () => {
    if (!selectedContent || !isEditing) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Edit className='w-4 h-4' />
            Edit {selectedContent.label}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='label'>Label</Label>
            <Input
              id='label'
              value={editForm.label || ''}
              onChange={e =>
                setEditForm({ ...editForm, label: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor='value'>Content</Label>
            {selectedContent.type === 'rich-text' ? (
              <Textarea
                id='value'
                value={editForm.value || ''}
                onChange={e =>
                  setEditForm({ ...editForm, value: e.target.value })
                }
                rows={4}
              />
            ) : (
              <Input
                id='value'
                value={editForm.value || ''}
                onChange={e =>
                  setEditForm({ ...editForm, value: e.target.value })
                }
              />
            )}
          </div>

          <div className='flex gap-2'>
            <Button onClick={handleSave} className='flex items-center gap-2'>
              <Save className='w-4 h-4' />
              Save
            </Button>
            <Button variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Page Content</h3>
        <Button size='sm' className='flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Add Content
        </Button>
      </div>

      {renderContentEditor()}

      <div className='space-y-2'>
        {mockContent.map(content => (
          <Card key={content.id} className='p-3'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='font-medium text-sm'>{content.label}</span>
                  <Badge variant='secondary' className='text-xs'>
                    {content.type}
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground line-clamp-2'>
                  {content.value}
                </p>
              </div>
              <div className='flex gap-1'>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => handleEdit(content)}
                  className='h-8 w-8 p-0'
                >
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  className='h-8 w-8 p-0 text-destructive hover:text-destructive'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
