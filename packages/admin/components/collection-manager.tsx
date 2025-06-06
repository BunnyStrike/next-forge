'use client';

import React, { useState } from 'react';
import { Database, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design-system/components/ui/select';
import { useAdmin } from '../hooks/use-admin';
import type { AdminCollection, AdminCollectionItem } from '../lib/types';

export const CollectionManager = () => {
  const { selectedCollection, setSelectedCollection, createCollectionItem, updateCollectionItem, deleteCollectionItem } = useAdmin();
  const [isCreating, setIsCreating] = useState(false);
  const [newItemForm, setNewItemForm] = useState<Record<string, any>>({});

  // Mock collection data - replace with actual data fetching
  const mockCollections: AdminCollection[] = [
    {
      id: '1',
      name: 'Blog Posts',
      slug: 'blog-posts',
      fields: [
        { id: '1', name: 'title', type: 'text', required: true },
        { id: '2', name: 'content', type: 'rich-text', required: true },
        { id: '3', name: 'published', type: 'boolean', required: false },
      ],
      items: [
        {
          id: '1',
          collectionId: '1',
          data: { title: 'First Post', content: 'Content here...', published: true },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          collectionId: '1',
          data: { title: 'Second Post', content: 'More content...', published: false },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      id: '2',
      name: 'Products',
      slug: 'products',
      fields: [
        { id: '1', name: 'name', type: 'text', required: true },
        { id: '2', name: 'price', type: 'text', required: true },
        { id: '3', name: 'description', type: 'textarea', required: false },
      ],
      items: [
        {
          id: '3',
          collectionId: '2',
          data: { name: 'Product 1', price: '$99', description: 'Great product' },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ];

  const handleCreateItem = async () => {
    if (selectedCollection) {
      await createCollectionItem(selectedCollection.id, newItemForm);
      setIsCreating(false);
      setNewItemForm({});
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    await deleteCollectionItem(itemId);
  };

  const renderCreateForm = () => {
    if (!selectedCollection || !isCreating) return null;

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New {selectedCollection.name.slice(0, -1)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedCollection.fields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.name}>
                {field.name} {field.required && <span className="text-destructive">*</span>}
              </Label>
              {field.type === 'select' ? (
                <Select onValueChange={(value) => setNewItemForm({ ...newItemForm, [field.name]: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'boolean' ? (
                <Select onValueChange={(value) => setNewItemForm({ ...newItemForm, [field.name]: value === 'true' })}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.name}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field.name}
                  value={newItemForm[field.name] || ''}
                  onChange={(e) => setNewItemForm({ ...newItemForm, [field.name]: e.target.value })}
                  required={field.required}
                />
              )}
            </div>
          ))}
          
          <div className="flex gap-2">
            <Button onClick={handleCreateItem}>Create</Button>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCollectionItems = () => {
    if (!selectedCollection) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Items ({selectedCollection.items.length})</h4>
          <Button size="sm" onClick={() => setIsCreating(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {selectedCollection.items.map((item) => (
          <Card key={item.id} className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {Object.entries(item.data).map(([key, value]) => (
                  <div key={key} className="mb-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                      {key}:
                    </span>
                    <span className="ml-2 text-sm">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteItem(item.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Collections</h3>
        {selectedCollection && (
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setSelectedCollection(null)}
          >
            Back to Collections
          </Button>
        )}
      </div>

      {!selectedCollection ? (
        <div className="space-y-2">
          {mockCollections.map((collection) => (
            <Card key={collection.id} className="p-3 cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedCollection(collection)}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="w-4 h-4" />
                    <span className="font-medium">{collection.name}</span>
                    <Badge variant="secondary">{collection.items.length} items</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {collection.fields.length} fields
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4" />
              <span className="font-medium">{selectedCollection.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Fields: {selectedCollection.fields.map(f => f.name).join(', ')}
            </div>
          </Card>

          {renderCreateForm()}
          {renderCollectionItems()}
        </div>
      )}
    </div>
  );
}; 