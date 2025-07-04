// Base User Types
export interface CommunityUser {
  id: string
  username: string
  displayName?: string
  email?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  joinedAt: Date
  lastActiveAt?: Date
  isVerified: boolean
  isOnline: boolean
  reputation: number
  level: number
  badges: UserBadge[]
  stats: UserStats
  preferences: UserPreferences
  roles: UserRole[]
  socialLinks?: SocialLinks
}

export interface UserStats {
  postsCount: number
  commentsCount: number
  likesReceived: number
  likesGiven: number
  followersCount: number
  followingCount: number
  topicsCreated: number
  solutionsAccepted: number
  helpfulVotes: number
  totalViews: number
}

export interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  showOnlineStatus: boolean
  showEmail: boolean
  allowDirectMessages: boolean
  allowMentions: boolean
  theme: 'light' | 'dark' | 'auto'
  language: string
  timezone: string
}

export interface SocialLinks {
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
  discord?: string
  telegram?: string
}

// Forum Types
export interface Forum {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  color?: string
  parentId?: string
  children?: Forum[]
  isPrivate: boolean
  requiresApproval: boolean
  allowedRoles: string[]
  moderators: CommunityUser[]
  stats: ForumStats
  settings: ForumSettings
  createdAt: Date
  updatedAt: Date
  position: number
}

export interface ForumStats {
  topicsCount: number
  postsCount: number
  lastPostAt?: Date
  lastPostBy?: CommunityUser
  activeUsers: number
  todayPosts: number
  weekPosts: number
  monthPosts: number
}

export interface ForumSettings {
  allowAnonymousPosts: boolean
  allowGuestViewing: boolean
  requireApproval: boolean
  allowPolls: boolean
  allowAttachments: boolean
  maxAttachmentSize: number
  allowedFileTypes: string[]
  autoLockAfterDays?: number
  slowMode?: number // seconds between posts
}

// Topic Types
export interface Topic {
  id: string
  title: string
  slug: string
  content: string
  contentType: 'text' | 'markdown' | 'html'
  forumId: string
  forum?: Forum
  authorId: string
  author: CommunityUser
  isPinned: boolean
  isLocked: boolean
  isFeatured: boolean
  isSolved: boolean
  acceptedAnswerId?: string
  tags: TopicTag[]
  attachments: Attachment[]
  poll?: Poll
  views: number
  votes: Vote[]
  voteScore: number
  commentsCount: number
  lastCommentAt?: Date
  lastCommentBy?: CommunityUser
  createdAt: Date
  updatedAt: Date
  editedAt?: Date
  editedBy?: CommunityUser
  moderationStatus: ModerationStatus
  reports: Report[]
}

export interface TopicTag {
  id: string
  name: string
  slug: string
  color?: string
  description?: string
  isOfficial: boolean
  usageCount: number
}

// Comment Types
export interface Comment {
  id: string
  content: string
  contentType: 'text' | 'markdown' | 'html'
  topicId: string
  topic?: Topic
  authorId: string
  author: CommunityUser
  parentId?: string
  parent?: Comment
  children?: Comment[]
  level: number
  isAcceptedAnswer: boolean
  attachments: Attachment[]
  mentions: UserMention[]
  votes: Vote[]
  voteScore: number
  createdAt: Date
  updatedAt: Date
  editedAt?: Date
  editedBy?: CommunityUser
  deletedAt?: Date
  deletedBy?: CommunityUser
  moderationStatus: ModerationStatus
  reports: Report[]
}

// Voting System
export interface Vote {
  id: string
  userId: string
  user?: CommunityUser
  targetType: 'topic' | 'comment'
  targetId: string
  voteType: 'up' | 'down'
  createdAt: Date
}

export interface VoteStats {
  upvotes: number
  downvotes: number
  score: number
  userVote?: 'up' | 'down'
}

// Badge and Achievement System
export interface Badge {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  category: BadgeCategory
  tier: BadgeTier
  requirements: BadgeRequirement[]
  isActive: boolean
  isSecret: boolean
  createdAt: Date
}

export type BadgeCategory = 
  | 'participation'
  | 'contribution'
  | 'moderation'
  | 'special'
  | 'anniversary'
  | 'achievement'

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary'

export interface BadgeRequirement {
  type: RequirementType
  value: number
  period?: 'day' | 'week' | 'month' | 'year' | 'all-time'
}

export type RequirementType =
  | 'posts_count'
  | 'comments_count'
  | 'likes_received'
  | 'reputation'
  | 'consecutive_days'
  | 'topics_created'
  | 'solutions_accepted'
  | 'years_member'

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  badge: Badge
  earnedAt: Date
  isVisible: boolean
  progress?: number
}

// Reputation System
export interface ReputationEvent {
  id: string
  userId: string
  user?: CommunityUser
  type: ReputationType
  points: number
  reason: string
  sourceType?: 'topic' | 'comment' | 'vote' | 'badge'
  sourceId?: string
  createdAt: Date
}

export type ReputationType =
  | 'post_upvote'
  | 'post_downvote'
  | 'comment_upvote'
  | 'comment_downvote'
  | 'solution_accepted'
  | 'badge_earned'
  | 'daily_login'
  | 'profile_completed'
  | 'first_post'
  | 'helpful_flag'
  | 'moderation_action'

// User Relationships
export interface UserFollow {
  id: string
  followerId: string
  follower: CommunityUser
  followingId: string
  following: CommunityUser
  createdAt: Date
  notificationSettings: FollowNotificationSettings
}

export interface FollowNotificationSettings {
  newPosts: boolean
  newComments: boolean
  achievements: boolean
  mentions: boolean
}

// Mentions and Notifications
export interface UserMention {
  id: string
  mentionerId: string
  mentioner: CommunityUser
  mentionedId: string
  mentioned: CommunityUser
  contentType: 'topic' | 'comment'
  contentId: string
  createdAt: Date
  isRead: boolean
}

export interface CommunityNotification {
  id: string
  userId: string
  user?: CommunityUser
  type: NotificationType
  title: string
  message: string
  data: Record<string, any>
  isRead: boolean
  createdAt: Date
  expiresAt?: Date
}

export type NotificationType =
  | 'mention'
  | 'reply'
  | 'follow'
  | 'like'
  | 'badge_earned'
  | 'solution_accepted'
  | 'topic_featured'
  | 'moderation_action'
  | 'new_follower_post'

// Activity Tracking
export interface Activity {
  id: string
  userId: string
  user?: CommunityUser
  type: ActivityType
  description: string
  targetType?: 'topic' | 'comment' | 'user' | 'forum'
  targetId?: string
  metadata: Record<string, any>
  isPublic: boolean
  createdAt: Date
}

export type ActivityType =
  | 'joined'
  | 'posted_topic'
  | 'commented'
  | 'upvoted'
  | 'downvoted'
  | 'followed_user'
  | 'earned_badge'
  | 'accepted_solution'
  | 'created_forum'
  | 'updated_profile'

// Polls
export interface Poll {
  id: string
  topicId: string
  question: string
  options: PollOption[]
  allowMultiple: boolean
  allowAddOptions: boolean
  isAnonymous: boolean
  expiresAt?: Date
  createdAt: Date
  totalVotes: number
}

export interface PollOption {
  id: string
  pollId: string
  text: string
  votes: PollVote[]
  voteCount: number
  percentage: number
}

export interface PollVote {
  id: string
  pollId: string
  optionId: string
  userId: string
  user?: CommunityUser
  createdAt: Date
}

// Attachments
export interface Attachment {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  uploadedById: string
  uploadedBy?: CommunityUser
  createdAt: Date
}

// Moderation
export interface Report {
  id: string
  reporterId: string
  reporter: CommunityUser
  targetType: 'topic' | 'comment' | 'user'
  targetId: string
  reason: ReportReason
  description: string
  status: ReportStatus
  assignedToId?: string
  assignedTo?: CommunityUser
  resolution?: string
  resolvedAt?: Date
  createdAt: Date
}

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate_content'
  | 'copyright'
  | 'off_topic'
  | 'duplicate'
  | 'misinformation'
  | 'other'

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed'

export type ModerationStatus = 'approved' | 'pending' | 'rejected' | 'flagged'

export interface ModerationAction {
  id: string
  moderatorId: string
  moderator: CommunityUser
  targetType: 'topic' | 'comment' | 'user'
  targetId: string
  action: ModerationType
  reason: string
  duration?: number // for temporary actions
  expiresAt?: Date
  createdAt: Date
}

export type ModerationType =
  | 'approve'
  | 'reject'
  | 'delete'
  | 'lock'
  | 'pin'
  | 'feature'
  | 'ban_user'
  | 'mute_user'
  | 'warn_user'
  | 'move_topic'

// User Roles and Permissions
export interface UserRole {
  id: string
  name: string
  slug: string
  description: string
  color?: string
  priority: number
  permissions: Permission[]
  isDefault: boolean
  isSystemRole: boolean
  createdAt: Date
}

export interface Permission {
  id: string
  name: string
  slug: string
  category: PermissionCategory
  description: string
}

export type PermissionCategory =
  | 'forum'
  | 'topic'
  | 'comment'
  | 'user'
  | 'moderation'
  | 'admin'

// Search and Discovery
export interface SearchResult {
  type: 'topic' | 'comment' | 'user' | 'forum'
  id: string
  title: string
  content: string
  snippet: string
  url: string
  author?: CommunityUser
  forum?: Forum
  createdAt: Date
  relevanceScore: number
  highlights: string[]
}

export interface SearchFilters {
  type?: ('topic' | 'comment' | 'user' | 'forum')[]
  forumIds?: string[]
  authorIds?: string[]
  tags?: string[]
  dateRange?: {
    start?: Date
    end?: Date
  }
  hasAttachments?: boolean
  isSolved?: boolean
  minScore?: number
  sortBy?: 'relevance' | 'date' | 'score' | 'replies'
  sortOrder?: 'asc' | 'desc'
}

// Events and Contests
export interface CommunityEvent {
  id: string
  title: string
  description: string
  type: EventType
  startDate: Date
  endDate: Date
  timezone: string
  location?: string
  isVirtual: boolean
  maxParticipants?: number
  registrationRequired: boolean
  registrationDeadline?: Date
  organizerId: string
  organizer: CommunityUser
  participants: EventParticipant[]
  tags: string[]
  attachments: Attachment[]
  status: EventStatus
  createdAt: Date
}

export type EventType = 'contest' | 'challenge' | 'meetup' | 'workshop' | 'ama' | 'announcement'

export type EventStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled'

export interface EventParticipant {
  id: string
  eventId: string
  userId: string
  user: CommunityUser
  registeredAt: Date
  attendedAt?: Date
  status: ParticipantStatus
}

export type ParticipantStatus = 'registered' | 'attended' | 'no_show' | 'cancelled'

export interface Contest extends CommunityEvent {
  rules: string
  prizes: ContestPrize[]
  judgeIds: string[]
  judges: CommunityUser[]
  submissions: ContestSubmission[]
  votingEnabled: boolean
  votingStartDate?: Date
  votingEndDate?: Date
  winnersAnnounced: boolean
}

export interface ContestPrize {
  id: string
  contestId: string
  position: number
  title: string
  description: string
  value?: string
  imageUrl?: string
}

export interface ContestSubmission {
  id: string
  contestId: string
  participantId: string
  participant: CommunityUser
  title: string
  description: string
  submissionUrl?: string
  attachments: Attachment[]
  votes: ContestVote[]
  voteCount: number
  judgeScores: JudgeScore[]
  averageScore?: number
  position?: number
  submittedAt: Date
}

export interface ContestVote {
  id: string
  submissionId: string
  voterId: string
  voter: CommunityUser
  createdAt: Date
}

export interface JudgeScore {
  id: string
  submissionId: string
  judgeId: string
  judge: CommunityUser
  score: number
  feedback?: string
  createdAt: Date
}

// Configuration and Settings
export interface CommunitySettings {
  general: GeneralSettings
  forum: ForumSettings
  moderation: ModerationSettings
  reputation: ReputationSettings
  notifications: NotificationSettings
  features: FeatureSettings
}

export interface GeneralSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  defaultLanguage: string
  allowGuestViewing: boolean
  requireEmailVerification: boolean
  allowUserRegistration: boolean
  defaultUserRole: string
  maxUsernameLength: number
  minUsernameLength: number
}

export interface ModerationSettings {
  autoModeration: boolean
  requireApprovalForNewUsers: boolean
  spamFilterEnabled: boolean
  profanityFilterEnabled: boolean
  maxReportsBeforeHide: number
  autoLockAfterReports: number
  moderatorNotifications: boolean
}

export interface ReputationSettings {
  enabled: boolean
  postUpvotePoints: number
  postDownvotePoints: number
  commentUpvotePoints: number
  commentDownvotePoints: number
  solutionAcceptedPoints: number
  badgePoints: Record<BadgeTier, number>
  dailyLoginPoints: number
  maxPointsPerDay: number
}

export interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  mentionNotifications: boolean
  followNotifications: boolean
  replyNotifications: boolean
  moderationNotifications: boolean
  digestFrequency: 'daily' | 'weekly' | 'monthly' | 'never'
}

export interface FeatureSettings {
  forumsEnabled: boolean
  commentsEnabled: boolean
  votingEnabled: boolean
  badgesEnabled: boolean
  reputationEnabled: boolean
  followingEnabled: boolean
  mentionsEnabled: boolean
  pollsEnabled: boolean
  attachmentsEnabled: boolean
  eventsEnabled: boolean
  contestsEnabled: boolean
  searchEnabled: boolean
  activityFeedEnabled: boolean
}

// API Response Types
export interface CommunityResponse<T = any> {
  data: T
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
  success: boolean
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ForumListParams extends PaginationParams {
  parentId?: string
  includeStats?: boolean
  includeChildren?: boolean
}

export interface TopicListParams extends PaginationParams {
  forumId?: string
  authorId?: string
  tags?: string[]
  isFeatured?: boolean
  isSolved?: boolean
  dateRange?: {
    start?: Date
    end?: Date
  }
}

export interface CommentListParams extends PaginationParams {
  topicId?: string
  authorId?: string
  parentId?: string
  includeChildren?: boolean
}

// Hooks and Context Types
export interface CommunityContextType {
  user: CommunityUser | null
  isAuthenticated: boolean
  permissions: string[]
  settings: CommunitySettings
  loading: boolean
  error: string | null
}

export interface ForumContextType {
  forum: Forum | null
  topics: Topic[]
  loading: boolean
  error: string | null
  createTopic: (data: Partial<Topic>) => Promise<Topic>
  updateTopic: (id: string, data: Partial<Topic>) => Promise<Topic>
  deleteTopic: (id: string) => Promise<void>
}

export interface TopicContextType {
  topic: Topic | null
  comments: Comment[]
  loading: boolean
  error: string | null
  addComment: (data: Partial<Comment>) => Promise<Comment>
  updateComment: (id: string, data: Partial<Comment>) => Promise<Comment>
  deleteComment: (id: string) => Promise<void>
  vote: (targetType: 'topic' | 'comment', targetId: string, voteType: 'up' | 'down') => Promise<void>
} 