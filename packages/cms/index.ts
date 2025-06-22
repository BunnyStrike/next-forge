// Custom CMS Implementation Placeholder
// Replace this with your own CMS implementation

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  image?: string
  authors: {
    name: string
    avatar?: string
    xUrl?: string
  }[]
  categories: {
    name: string
  }[]
}

export interface Post extends PostMeta {
  body: {
    plainText: string
    html: string
    readingTime: number
  }
}

export interface LegalPostMeta {
  slug: string
  title: string
  description: string
}

export interface LegalPost extends LegalPostMeta {
  body: {
    plainText: string
    html: string
    readingTime: number
  }
}

// Blog API - Replace with your own CMS implementation
export const blog = {
  getPosts: async (): Promise<PostMeta[]> => {
    // TODO: Implement your own blog posts fetching logic
    console.warn('blog.getPosts: Implement your own CMS blog posts fetching')
    return []
  },

  getLatestPost: async (): Promise<Post | null> => {
    // TODO: Implement your own latest post fetching logic
    console.warn('blog.getLatestPost: Implement your own CMS latest post fetching')
    return null
  },

  getPost: async (slug: string): Promise<Post | null> => {
    // TODO: Implement your own single post fetching logic
    console.warn(`blog.getPost(${slug}): Implement your own CMS single post fetching`)
    return null
  },
}

// Legal Pages API - Replace with your own CMS implementation
export const legal = {
  getPosts: async (): Promise<LegalPost[]> => {
    // TODO: Implement your own legal pages fetching logic
    console.warn('legal.getPosts: Implement your own CMS legal pages fetching')
    return []
  },

  getLatestPost: async (): Promise<LegalPost | null> => {
    // TODO: Implement your own latest legal post fetching logic
    console.warn('legal.getLatestPost: Implement your own CMS latest legal post fetching')
    return null
  },

  getPost: async (slug: string): Promise<LegalPost | null> => {
    // TODO: Implement your own single legal post fetching logic
    console.warn(`legal.getPost(${slug}): Implement your own CMS single legal post fetching`)
    return null
  },
}
