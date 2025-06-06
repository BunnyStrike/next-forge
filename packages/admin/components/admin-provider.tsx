'use client';

import React, { useState, type ReactNode } from 'react';
import { AdminContext } from '../hooks/use-admin';
import type { AdminContextType, AdminContent, AdminCollection } from '../lib/types';

type AdminProviderProps = {
  children: ReactNode;
};

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'collections'>('content');
  const [selectedContent, setSelectedContent] = useState<AdminContent | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<AdminCollection | null>(null);

  const openAdmin = () => setIsOpen(true);
  const closeAdmin = () => setIsOpen(false);

  // Mock implementations - replace with actual API calls
  const updateContent = async (id: string, updates: Partial<AdminContent>) => {
    console.log('Updating content:', id, updates);
    // Implement API call to update content
  };

  const createCollectionItem = async (collectionId: string, data: Record<string, any>) => {
    console.log('Creating collection item:', collectionId, data);
    // Implement API call to create collection item
  };

  const updateCollectionItem = async (id: string, data: Record<string, any>) => {
    console.log('Updating collection item:', id, data);
    // Implement API call to update collection item
  };

  const deleteCollectionItem = async (id: string) => {
    console.log('Deleting collection item:', id);
    // Implement API call to delete collection item
  };

  const value: AdminContextType = {
    isOpen,
    activeTab,
    selectedContent,
    selectedCollection,
    openAdmin,
    closeAdmin,
    setActiveTab,
    setSelectedContent,
    setSelectedCollection,
    updateContent,
    createCollectionItem,
    updateCollectionItem,
    deleteCollectionItem,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 