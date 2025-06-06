export type AdminContent = {
  id: string;
  type: 'text' | 'image' | 'rich-text' | 'link' | 'button';
  label: string;
  value: string;
  metadata?: Record<string, any>;
};

export type AdminCollection = {
  id: string;
  name: string;
  slug: string;
  fields: AdminField[];
  items: AdminCollectionItem[];
};

export type AdminField = {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'rich-text' | 'image' | 'date' | 'boolean' | 'select';
  required?: boolean;
  options?: string[]; // for select fields
  validation?: Record<string, any>;
};

export type AdminCollectionItem = {
  id: string;
  collectionId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminContextType = {
  isOpen: boolean;
  activeTab: 'content' | 'collections';
  selectedContent: AdminContent | null;
  selectedCollection: AdminCollection | null;
  openAdmin: () => void;
  closeAdmin: () => void;
  setActiveTab: (tab: 'content' | 'collections') => void;
  setSelectedContent: (content: AdminContent | null) => void;
  setSelectedCollection: (collection: AdminCollection | null) => void;
  updateContent: (id: string, updates: Partial<AdminContent>) => Promise<void>;
  createCollectionItem: (collectionId: string, data: Record<string, any>) => Promise<void>;
  updateCollectionItem: (id: string, data: Record<string, any>) => Promise<void>;
  deleteCollectionItem: (id: string) => Promise<void>;
};

export type AdminPermission = 'read' | 'write' | 'admin';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  permissions: AdminPermission[];
}; 