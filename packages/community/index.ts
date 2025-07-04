// Types
export * from './lib/types'

// Services
export { communityService, CommunityService } from './lib/community-service'

// Components
export { ForumList } from './components/forum-list'
export { TopicList } from './components/topic-list'
export { CommentThread } from './components/comment-thread'
export { UserProfile } from './components/user-profile'

// Re-export commonly used types for convenience
export type {
  Forum,
  Topic,
  Comment,
  CommunityUser,
  Vote,
  Badge,
  UserBadge,
  Activity,
  CommunityNotification,
  Poll,
  CommunityEvent,
  Contest,
  ReputationEvent,
  SearchResult,
  SearchFilters,
  CommunityResponse,
  CommunitySettings
} from './lib/types' 