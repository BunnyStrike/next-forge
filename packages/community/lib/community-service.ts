import {
  Forum,
  Topic,
  Comment,
  CommunityUser,
  Vote,
  Badge,
  UserBadge,
  UserFollow,
  Activity,
  Report,
  CommunityNotification,
  Poll,
  CommunityEvent,
  Contest,
  ReputationEvent,
  ForumListParams,
  TopicListParams,
  CommentListParams,
  CommunityResponse,
  SearchResult,
  SearchFilters,
  ModerationAction,
  UserMention
} from './types'

export class CommunityService {
  private baseUrl: string
  private apiKey?: string

  constructor(config: { baseUrl: string; apiKey?: string }) {
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
  }

  // Forum Management
  async getForums(params?: ForumListParams): Promise<CommunityResponse<Forum[]>> {
    const queryParams = new URLSearchParams()
    if (params?.parentId) queryParams.set('parentId', params.parentId)
    if (params?.includeStats) queryParams.set('includeStats', 'true')
    if (params?.includeChildren) queryParams.set('includeChildren', 'true')
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())

    const response = await this.fetch(`/forums?${queryParams}`)
    return response.json()
  }

  async getForum(id: string): Promise<CommunityResponse<Forum>> {
    const response = await this.fetch(`/forums/${id}`)
    return response.json()
  }

  async createForum(data: Partial<Forum>): Promise<CommunityResponse<Forum>> {
    const response = await this.fetch('/forums', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async updateForum(id: string, data: Partial<Forum>): Promise<CommunityResponse<Forum>> {
    const response = await this.fetch(`/forums/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async deleteForum(id: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/forums/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  // Topic Management
  async getTopics(params?: TopicListParams): Promise<CommunityResponse<Topic[]>> {
    const queryParams = new URLSearchParams()
    if (params?.forumId) queryParams.set('forumId', params.forumId)
    if (params?.authorId) queryParams.set('authorId', params.authorId)
    if (params?.tags) queryParams.set('tags', params.tags.join(','))
    if (params?.isFeatured !== undefined) queryParams.set('isFeatured', params.isFeatured.toString())
    if (params?.isSolved !== undefined) queryParams.set('isSolved', params.isSolved.toString())
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder)

    const response = await this.fetch(`/topics?${queryParams}`)
    return response.json()
  }

  async getTopic(id: string): Promise<CommunityResponse<Topic>> {
    const response = await this.fetch(`/topics/${id}`)
    return response.json()
  }

  async createTopic(data: Partial<Topic>): Promise<CommunityResponse<Topic>> {
    const response = await this.fetch('/topics', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async updateTopic(id: string, data: Partial<Topic>): Promise<CommunityResponse<Topic>> {
    const response = await this.fetch(`/topics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async deleteTopic(id: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/topics/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  async pinTopic(id: string): Promise<CommunityResponse<Topic>> {
    const response = await this.fetch(`/topics/${id}/pin`, {
      method: 'POST'
    })
    return response.json()
  }

  async lockTopic(id: string): Promise<CommunityResponse<Topic>> {
    const response = await this.fetch(`/topics/${id}/lock`, {
      method: 'POST'
    })
    return response.json()
  }

  async featureTopic(id: string): Promise<CommunityResponse<Topic>> {
    const response = await this.fetch(`/topics/${id}/feature`, {
      method: 'POST'
    })
    return response.json()
  }

  async solveTopic(id: string, commentId: string): Promise<CommunityResponse<Topic>> {
    const response = await this.fetch(`/topics/${id}/solve`, {
      method: 'POST',
      body: JSON.stringify({ commentId })
    })
    return response.json()
  }

  // Comment Management
  async getComments(params?: CommentListParams): Promise<CommunityResponse<Comment[]>> {
    const queryParams = new URLSearchParams()
    if (params?.topicId) queryParams.set('topicId', params.topicId)
    if (params?.authorId) queryParams.set('authorId', params.authorId)
    if (params?.parentId) queryParams.set('parentId', params.parentId)
    if (params?.includeChildren) queryParams.set('includeChildren', 'true')
    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy)
    if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder)

    const response = await this.fetch(`/comments?${queryParams}`)
    return response.json()
  }

  async getComment(id: string): Promise<CommunityResponse<Comment>> {
    const response = await this.fetch(`/comments/${id}`)
    return response.json()
  }

  async createComment(data: Partial<Comment>): Promise<CommunityResponse<Comment>> {
    const response = await this.fetch('/comments', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async updateComment(id: string, data: Partial<Comment>): Promise<CommunityResponse<Comment>> {
    const response = await this.fetch(`/comments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async deleteComment(id: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/comments/${id}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  // Voting System
  async vote(targetType: 'topic' | 'comment', targetId: string, voteType: 'up' | 'down'): Promise<CommunityResponse<Vote>> {
    const response = await this.fetch('/votes', {
      method: 'POST',
      body: JSON.stringify({ targetType, targetId, voteType })
    })
    return response.json()
  }

  async removeVote(targetType: 'topic' | 'comment', targetId: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/votes/${targetType}/${targetId}`, {
      method: 'DELETE'
    })
    return response.json()
  }

  async getVoteStats(targetType: 'topic' | 'comment', targetId: string): Promise<CommunityResponse<{ upvotes: number; downvotes: number; score: number; userVote?: 'up' | 'down' }>> {
    const response = await this.fetch(`/votes/${targetType}/${targetId}/stats`)
    return response.json()
  }

  // User Management
  async getUser(id: string): Promise<CommunityResponse<CommunityUser>> {
    const response = await this.fetch(`/users/${id}`)
    return response.json()
  }

  async updateUser(id: string, data: Partial<CommunityUser>): Promise<CommunityResponse<CommunityUser>> {
    const response = await this.fetch(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async getUserActivity(userId: string, page = 1, limit = 20): Promise<CommunityResponse<Activity[]>> {
    const response = await this.fetch(`/users/${userId}/activity?page=${page}&limit=${limit}`)
    return response.json()
  }

  async getUserReputation(userId: string): Promise<CommunityResponse<{ total: number; events: ReputationEvent[] }>> {
    const response = await this.fetch(`/users/${userId}/reputation`)
    return response.json()
  }

  // Following System
  async followUser(userId: string): Promise<CommunityResponse<UserFollow>> {
    const response = await this.fetch(`/users/${userId}/follow`, {
      method: 'POST'
    })
    return response.json()
  }

  async unfollowUser(userId: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/users/${userId}/follow`, {
      method: 'DELETE'
    })
    return response.json()
  }

  async getFollowers(userId: string, page = 1, limit = 20): Promise<CommunityResponse<UserFollow[]>> {
    const response = await this.fetch(`/users/${userId}/followers?page=${page}&limit=${limit}`)
    return response.json()
  }

  async getFollowing(userId: string, page = 1, limit = 20): Promise<CommunityResponse<UserFollow[]>> {
    const response = await this.fetch(`/users/${userId}/following?page=${page}&limit=${limit}`)
    return response.json()
  }

  // Badge System
  async getBadges(): Promise<CommunityResponse<Badge[]>> {
    const response = await this.fetch('/badges')
    return response.json()
  }

  async getUserBadges(userId: string): Promise<CommunityResponse<UserBadge[]>> {
    const response = await this.fetch(`/users/${userId}/badges`)
    return response.json()
  }

  async awardBadge(userId: string, badgeId: string): Promise<CommunityResponse<UserBadge>> {
    const response = await this.fetch('/badges/award', {
      method: 'POST',
      body: JSON.stringify({ userId, badgeId })
    })
    return response.json()
  }

  async checkBadgeProgress(userId: string, badgeId: string): Promise<CommunityResponse<{ progress: number; total: number; canEarn: boolean }>> {
    const response = await this.fetch(`/users/${userId}/badges/${badgeId}/progress`)
    return response.json()
  }

  // Notifications
  async getNotifications(page = 1, limit = 20): Promise<CommunityResponse<CommunityNotification[]>> {
    const response = await this.fetch(`/notifications?page=${page}&limit=${limit}`)
    return response.json()
  }

  async markNotificationRead(id: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/notifications/${id}/read`, {
      method: 'POST'
    })
    return response.json()
  }

  async markAllNotificationsRead(): Promise<CommunityResponse<void>> {
    const response = await this.fetch('/notifications/read-all', {
      method: 'POST'
    })
    return response.json()
  }

  async getUnreadCount(): Promise<CommunityResponse<{ count: number }>> {
    const response = await this.fetch('/notifications/unread-count')
    return response.json()
  }

  // Mentions
  async getMentions(page = 1, limit = 20): Promise<CommunityResponse<UserMention[]>> {
    const response = await this.fetch(`/mentions?page=${page}&limit=${limit}`)
    return response.json()
  }

  async markMentionRead(id: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/mentions/${id}/read`, {
      method: 'POST'
    })
    return response.json()
  }

  // Search
  async search(query: string, filters?: SearchFilters): Promise<CommunityResponse<SearchResult[]>> {
    const params = new URLSearchParams({ q: query })
    
    if (filters?.type) params.set('type', filters.type.join(','))
    if (filters?.forumIds) params.set('forumIds', filters.forumIds.join(','))
    if (filters?.authorIds) params.set('authorIds', filters.authorIds.join(','))
    if (filters?.tags) params.set('tags', filters.tags.join(','))
    if (filters?.hasAttachments !== undefined) params.set('hasAttachments', filters.hasAttachments.toString())
    if (filters?.isSolved !== undefined) params.set('isSolved', filters.isSolved.toString())
    if (filters?.minScore) params.set('minScore', filters.minScore.toString())
    if (filters?.sortBy) params.set('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder)

    const response = await this.fetch(`/search?${params}`)
    return response.json()
  }

  // Polls
  async createPoll(topicId: string, pollData: Partial<Poll>): Promise<CommunityResponse<Poll>> {
    const response = await this.fetch(`/topics/${topicId}/poll`, {
      method: 'POST',
      body: JSON.stringify(pollData)
    })
    return response.json()
  }

  async votePoll(pollId: string, optionIds: string[]): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/polls/${pollId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ optionIds })
    })
    return response.json()
  }

  async getPollResults(pollId: string): Promise<CommunityResponse<Poll>> {
    const response = await this.fetch(`/polls/${pollId}/results`)
    return response.json()
  }

  // Events and Contests
  async getEvents(page = 1, limit = 20): Promise<CommunityResponse<CommunityEvent[]>> {
    const response = await this.fetch(`/events?page=${page}&limit=${limit}`)
    return response.json()
  }

  async getEvent(id: string): Promise<CommunityResponse<CommunityEvent>> {
    const response = await this.fetch(`/events/${id}`)
    return response.json()
  }

  async createEvent(data: Partial<CommunityEvent>): Promise<CommunityResponse<CommunityEvent>> {
    const response = await this.fetch('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  async registerForEvent(eventId: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/events/${eventId}/register`, {
      method: 'POST'
    })
    return response.json()
  }

  async getContests(page = 1, limit = 20): Promise<CommunityResponse<Contest[]>> {
    const response = await this.fetch(`/contests?page=${page}&limit=${limit}`)
    return response.json()
  }

  async submitToContest(contestId: string, submissionData: any): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/contests/${contestId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData)
    })
    return response.json()
  }

  // Moderation
  async reportContent(targetType: 'topic' | 'comment' | 'user', targetId: string, reason: string, description: string): Promise<CommunityResponse<Report>> {
    const response = await this.fetch('/reports', {
      method: 'POST',
      body: JSON.stringify({ targetType, targetId, reason, description })
    })
    return response.json()
  }

  async getReports(page = 1, limit = 20): Promise<CommunityResponse<Report[]>> {
    const response = await this.fetch(`/reports?page=${page}&limit=${limit}`)
    return response.json()
  }

  async resolveReport(reportId: string, resolution: string): Promise<CommunityResponse<void>> {
    const response = await this.fetch(`/reports/${reportId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ resolution })
    })
    return response.json()
  }

  async moderateContent(targetType: 'topic' | 'comment', targetId: string, action: string, reason: string): Promise<CommunityResponse<ModerationAction>> {
    const response = await this.fetch('/moderation/action', {
      method: 'POST',
      body: JSON.stringify({ targetType, targetId, action, reason })
    })
    return response.json()
  }

  // Activity Feed
  async getActivityFeed(page = 1, limit = 20): Promise<CommunityResponse<Activity[]>> {
    const response = await this.fetch(`/activity?page=${page}&limit=${limit}`)
    return response.json()
  }

  async getFollowingActivity(page = 1, limit = 20): Promise<CommunityResponse<Activity[]>> {
    const response = await this.fetch(`/activity/following?page=${page}&limit=${limit}`)
    return response.json()
  }

  // Analytics
  async getCommunityStats(): Promise<CommunityResponse<{
    totalUsers: number
    totalTopics: number
    totalComments: number
    activeUsers: number
    topContributors: CommunityUser[]
    popularTopics: Topic[]
    recentActivity: Activity[]
  }>> {
    const response = await this.fetch('/stats')
    return response.json()
  }

  async getUserStats(userId: string): Promise<CommunityResponse<{
    postsCount: number
    commentsCount: number
    reputation: number
    badges: number
    followers: number
    following: number
    joinedDaysAgo: number
  }>> {
    const response = await this.fetch(`/users/${userId}/stats`)
    return response.json()
  }

  // Utility Methods
  private async fetch(path: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseUrl}${path}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`Community API error: ${response.status} ${response.statusText}`)
    }

    return response
  }

  // Real-time helpers (would integrate with WebSocket or SSE)
  async subscribeToTopic(topicId: string, callback: (data: any) => void): Promise<() => void> {
    // Implementation would depend on real-time solution (WebSocket, SSE, etc.)
    // Return unsubscribe function
    return () => {}
  }

  async subscribeToUser(userId: string, callback: (data: any) => void): Promise<() => void> {
    // Implementation would depend on real-time solution
    return () => {}
  }

  async subscribeToForum(forumId: string, callback: (data: any) => void): Promise<() => void> {
    // Implementation would depend on real-time solution
    return () => {}
  }
}

// Default instance
export const communityService = new CommunityService({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  apiKey: process.env.COMMUNITY_API_KEY
}) 