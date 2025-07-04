import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CommunityService } from '../lib/community-service'
import type { Forum, Topic, Comment, CommunityUser } from '../lib/types'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('CommunityService', () => {
  let service: CommunityService
  
  beforeEach(() => {
    service = new CommunityService({
      baseUrl: 'http://localhost:3000/api',
      apiKey: 'test-key'
    })
    mockFetch.mockClear()
  })

  describe('Forum Management', () => {
    it('should fetch forums with correct parameters', async () => {
      const mockForums: Forum[] = [
        {
          id: '1',
          name: 'General Discussion',
          slug: 'general-discussion',
          description: 'General discussion forum',
          isPrivate: false,
          requiresApproval: false,
          allowedRoles: [],
          moderators: [],
          stats: {
            topicsCount: 10,
            postsCount: 50,
            activeUsers: 5,
            todayPosts: 2,
            weekPosts: 15,
            monthPosts: 40
          },
          settings: {
            allowAnonymousPosts: false,
            allowGuestViewing: true,
            requireApproval: false,
            allowPolls: true,
            allowAttachments: true,
            maxAttachmentSize: 10485760,
            allowedFileTypes: ['jpg', 'png', 'pdf']
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          position: 1
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockForums })
      })

      const result = await service.getForums({ 
        includeStats: true, 
        includeChildren: true 
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/forums?includeStats=true&includeChildren=true',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key',
            'Content-Type': 'application/json'
          })
        })
      )
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockForums)
    })

    it('should create a forum', async () => {
      const newForum = {
        name: 'New Forum',
        description: 'A new forum',
        isPrivate: false
      }

      const createdForum: Forum = {
        id: '2',
        slug: 'new-forum',
        allowedRoles: [],
        moderators: [],
        requiresApproval: false,
        stats: {
          topicsCount: 0,
          postsCount: 0,
          activeUsers: 0,
          todayPosts: 0,
          weekPosts: 0,
          monthPosts: 0
        },
        settings: {
          allowAnonymousPosts: false,
          allowGuestViewing: true,
          requireApproval: false,
          allowPolls: true,
          allowAttachments: true,
          maxAttachmentSize: 10485760,
          allowedFileTypes: ['jpg', 'png', 'pdf']
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        position: 2,
        ...newForum
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: createdForum })
      })

      const result = await service.createForum(newForum)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/forums',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newForum)
        })
      )
      expect(result.success).toBe(true)
      expect(result.data.name).toBe(newForum.name)
    })
  })

  describe('Topic Management', () => {
    it('should fetch topics with filters', async () => {
      const mockTopics: Topic[] = [
        {
          id: '1',
          title: 'Test Topic',
          slug: 'test-topic',
          content: 'This is a test topic',
          contentType: 'text',
          forumId: '1',
          authorId: 'user1',
          author: {
            id: 'user1',
            username: 'testuser',
            email: 'test@example.com',
            isVerified: false,
            isOnline: true,
            reputation: 100,
            level: 1,
            badges: [],
            stats: {
              postsCount: 5,
              commentsCount: 10,
              likesReceived: 15,
              likesGiven: 8,
              followersCount: 2,
              followingCount: 3,
              topicsCreated: 5,
              solutionsAccepted: 1,
              helpfulVotes: 3,
              totalViews: 150
            },
            preferences: {
              emailNotifications: true,
              pushNotifications: true,
              showOnlineStatus: true,
              showEmail: false,
              allowDirectMessages: true,
              allowMentions: true,
              theme: 'light',
              language: 'en',
              timezone: 'UTC'
            },
            roles: [],
            joinedAt: new Date()
          },
          isPinned: false,
          isLocked: false,
          isFeatured: false,
          isSolved: false,
          tags: [],
          attachments: [],
          views: 100,
          votes: [],
          voteScore: 5,
          commentsCount: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
          moderationStatus: 'approved',
          reports: []
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockTopics })
      })

      const result = await service.getTopics({
        forumId: '1',
        isFeatured: true,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/topics?forumId=1&isFeatured=true&sortBy=createdAt&sortOrder=desc',
        expect.any(Object)
      )
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockTopics)
    })

    it('should vote on a topic', async () => {
      const vote = {
        id: '1',
        userId: 'user1',
        targetType: 'topic' as const,
        targetId: 'topic1',
        voteType: 'up' as const,
        createdAt: new Date()
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: vote })
      })

      const result = await service.vote('topic', 'topic1', 'up')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/votes',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            targetType: 'topic',
            targetId: 'topic1',
            voteType: 'up'
          })
        })
      )
      expect(result.success).toBe(true)
    })
  })

  describe('Comment Management', () => {
    it('should fetch comments with pagination', async () => {
      const mockComments: Comment[] = [
        {
          id: '1',
          content: 'Great topic!',
          contentType: 'text',
          topicId: 'topic1',
          authorId: 'user1',
          author: {
            id: 'user1',
            username: 'commenter',
            isVerified: false,
            isOnline: true,
            reputation: 50,
            level: 1,
            badges: [],
            stats: {
              postsCount: 1,
              commentsCount: 5,
              likesReceived: 10,
              likesGiven: 3,
              followersCount: 0,
              followingCount: 1,
              topicsCreated: 1,
              solutionsAccepted: 0,
              helpfulVotes: 2,
              totalViews: 50
            },
            preferences: {
              emailNotifications: true,
              pushNotifications: true,
              showOnlineStatus: true,
              showEmail: false,
              allowDirectMessages: true,
              allowMentions: true,
              theme: 'light',
              language: 'en',
              timezone: 'UTC'
            },
            roles: [],
            joinedAt: new Date()
          },
          level: 0,
          isAcceptedAnswer: false,
          attachments: [],
          mentions: [],
          votes: [],
          voteScore: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          moderationStatus: 'approved',
          reports: []
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockComments })
      })

      const result = await service.getComments({
        topicId: 'topic1',
        page: 1,
        limit: 20
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/comments?topicId=topic1&page=1&limit=20',
        expect.any(Object)
      )
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockComments)
    })

    it('should create a comment', async () => {
      const newComment = {
        content: 'This is a new comment',
        topicId: 'topic1',
        contentType: 'text' as const
      }

      const createdComment: Comment = {
        id: '2',
        authorId: 'user1',
        author: {
          id: 'user1',
          username: 'commenter',
          isVerified: false,
          isOnline: true,
          reputation: 50,
          level: 1,
          badges: [],
          stats: {
            postsCount: 1,
            commentsCount: 6,
            likesReceived: 10,
            likesGiven: 3,
            followersCount: 0,
            followingCount: 1,
            topicsCreated: 1,
            solutionsAccepted: 0,
            helpfulVotes: 2,
            totalViews: 50
          },
          preferences: {
            emailNotifications: true,
            pushNotifications: true,
            showOnlineStatus: true,
            showEmail: false,
            allowDirectMessages: true,
            allowMentions: true,
            theme: 'light',
            language: 'en',
            timezone: 'UTC'
          },
          roles: [],
          joinedAt: new Date()
        },
        level: 0,
        isAcceptedAnswer: false,
        attachments: [],
        mentions: [],
        votes: [],
        voteScore: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        moderationStatus: 'approved',
        reports: [],
        ...newComment
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: createdComment })
      })

      const result = await service.createComment(newComment)

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/comments',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newComment)
        })
      )
      expect(result.success).toBe(true)
      expect(result.data.content).toBe(newComment.content)
    })
  })

  describe('User Management', () => {
    it('should fetch user profile', async () => {
      const mockUser: CommunityUser = {
        id: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        email: 'test@example.com',
        bio: 'A test user',
        isVerified: true,
        isOnline: false,
        reputation: 500,
        level: 5,
        badges: [],
        stats: {
          postsCount: 25,
          commentsCount: 100,
          likesReceived: 200,
          likesGiven: 150,
          followersCount: 10,
          followingCount: 15,
          topicsCreated: 25,
          solutionsAccepted: 5,
          helpfulVotes: 30,
          totalViews: 1000
        },
        preferences: {
          emailNotifications: true,
          pushNotifications: false,
          showOnlineStatus: true,
          showEmail: false,
          allowDirectMessages: true,
          allowMentions: true,
          theme: 'dark',
          language: 'en',
          timezone: 'UTC'
        },
        roles: [],
        joinedAt: new Date()
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockUser })
      })

      const result = await service.getUser('user1')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/user1',
        expect.any(Object)
      )
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockUser)
    })

    it('should follow a user', async () => {
      const follow = {
        id: '1',
        followerId: 'user1',
        followingId: 'user2',
        createdAt: new Date(),
        notificationSettings: {
          newPosts: true,
          newComments: false,
          achievements: true,
          mentions: true
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: follow })
      })

      const result = await service.followUser('user2')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/user2/follow',
        expect.objectContaining({
          method: 'POST'
        })
      )
      expect(result.success).toBe(true)
    })
  })

  describe('Search', () => {
    it('should search with filters', async () => {
      const mockResults = [
        {
          type: 'topic' as const,
          id: '1',
          title: 'Search Result',
          content: 'This is a search result',
          snippet: 'This is a search...',
          url: '/topics/1',
          createdAt: new Date(),
          relevanceScore: 0.95,
          highlights: ['search', 'result']
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockResults })
      })

      const result = await service.search('test query', {
        type: ['topic'],
        sortBy: 'relevance',
        sortOrder: 'desc'
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/search?q=test+query&type=topic&sortBy=relevance&sortOrder=desc',
        expect.any(Object)
      )
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockResults)
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      })

      await expect(service.getForum('nonexistent')).rejects.toThrow(
        'Community API error: 404 Not Found'
      )
    })

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(service.getForums()).rejects.toThrow('Network error')
    })
  })
}) 