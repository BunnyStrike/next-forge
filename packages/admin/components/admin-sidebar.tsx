'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Database, Settings } from 'lucide-react';
import { Button } from '@repo/design-system/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@repo/design-system/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/design-system/components/ui/card';
import { useAdmin } from '../hooks/use-admin';
import { ContentManager } from './content-manager';
import { CollectionManager } from './collection-manager';

export const AdminSidebar = () => {
  const { isOpen, activeTab, closeAdmin, setActiveTab } = useAdmin();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeAdmin}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-background border-l border-border z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Admin Panel
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeAdmin}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-2 m-4 mb-0">
                    <TabsTrigger value="content" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger value="collections" className="flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Collections
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex-1 overflow-auto p-4 pt-2">
                    <TabsContent value="content" className="mt-2">
                      <ContentManager />
                    </TabsContent>
                    
                    <TabsContent value="collections" className="mt-2">
                      <CollectionManager />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}; 