# @repo/community

A comprehensive community and social features package for building forums, discussion boards, and social platforms.

## Features

- **Forum System**: Hierarchical forum organization with categories and subcategories
- **Topics & Comments**: Threaded discussions with nested replies
- **Voting System**: Upvote/downvote functionality for content quality
- **User Profiles**: Rich user profiles with stats, badges, and social features
- **Badge System**: Achievement system with multiple tiers (Bronze, Silver, Gold, Platinum, Legendary)
- **Reputation System**: Point-based reputation with configurable scoring
- **Social Features**: Follow/unfollow users, activity feeds, mentions
- **Moderation Tools**: Content reporting, moderation actions, user management
- **Search & Discovery**: Full-text search with filters and relevance scoring
- **Real-time Features**: Live notifications, activity tracking
- **Events & Contests**: Community events, contests, and competitions
- **Polls**: Interactive polls within topics
- **Rich Content**: Support for attachments, rich text, and media

## Installation

```bash
npm install @repo/community
```

## Quick Start

### Basic Setup

```tsx
import { 
  ForumList, 
  TopicList, 
  CommentThread, 
  UserProfile,
  communityService 
} from '@repo/community'

// Configure the service
communityService.configure({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  apiKey: process.env.COMMUNITY_API_KEY
})

// Use components in your app
function CommunityPage() {
  return (
    <div>
      <ForumList 
        showCreateButton={true}
        onForumClick={(forum) => console.log('Forum clicked:', forum)}
      />
    </div>
  )
}
```

### Forum Management

```tsx
import { ForumList, communityService } from '@repo/community'

function ForumsPage() {
  const handleCreateForum = async () => {
    const newForum = await communityService.createForum({
      name: 'General Discussion',
      description: 'A place for general discussions',
      isPrivate: false
    })
    console.log('Created forum:', newForum)
  }

  return (
    <ForumList 
      showCreateButton={true}
      onCreateForum={handleCreateForum}
      onForumClick={(forum) => router.push(`/forums/${forum.slug}`)}
    />
  )
}
```

### Topic Discussions

```tsx
import { TopicList, CommentThread } from '@repo/community'

function ForumPage({ forumId }: { forumId: string }) {
  return (
    <div className="space-y-6">
      <TopicList 
        forumId={forumId}
        showCreateButton={true}
        onTopicClick={(topic) => router.push(`/topics/${topic.slug}`)}
      />
    </div>
  )
}

function TopicPage({ topicId }: { topicId: string }) {
  return (
    <div>
      {/* Topic content here */}
      <CommentThread 
        topicId={topicId}
        allowReplies={true}
        allowVoting={true}
        maxDepth={5}
      />
    </div>
  )
}
```

### User Profiles

```tsx
import { UserProfile, BadgeShowcase } from '@repo/community'

function ProfilePage({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <UserProfile 
        userId={userId}
        currentUser={currentUser}
        onFollowChange={(isFollowing) => {
          console.log('Follow status changed:', isFollowing)
        }}
      />
      
      <BadgeShowcase 
        userId={userId}
        showProgress={true}
        limit={12}
      />
    </div>
  )
}
```

## API Reference

### CommunityService

The main service class for interacting with the community API.

#### Configuration

```tsx
const service = new CommunityService({
  baseUrl: 'https://api.example.com',
  apiKey: 'your-api-key'
})
```

#### Forum Methods

```tsx
// Get all forums
const forums = await service.getForums({
  includeStats: true,
  includeChildren: true
})

// Get specific forum
const forum = await service.getForum('forum-id')

// Create forum
const newForum = await service.createForum({
  name: 'New Forum',
  description: 'Forum description',
  isPrivate: false
})

// Update forum
const updatedForum = await service.updateForum('forum-id', {
  description: 'Updated description'
})
```

#### Topic Methods

```tsx
// Get topics
const topics = await service.getTopics({
  forumId: 'forum-id',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  isFeatured: true
})

// Create topic
const newTopic = await service.createTopic({
  title: 'New Topic',
  content: 'Topic content',
  forumId: 'forum-id',
  tags: ['tag1', 'tag2']
})

// Vote on topic
await service.vote('topic', 'topic-id', 'up')
```

#### Comment Methods

```tsx
// Get comments
const comments = await service.getComments({
  topicId: 'topic-id',
  includeChildren: true
})

// Create comment
const newComment = await service.createComment({
  content: 'Comment content',
  topicId: 'topic-id',
  parentId: 'parent-comment-id' // optional for replies
})
```

#### User Methods

```tsx
// Get user profile
const user = await service.getUser('user-id')

// Follow user
await service.followUser('user-id')

// Get user badges
const badges = await service.getUserBadges('user-id')

// Get user activity
const activity = await service.getUserActivity('user-id')
```

#### Search Methods

```tsx
// Search content
const results = await service.search('query', {
  type: ['topic', 'comment'],
  forumIds: ['forum-1', 'forum-2'],
  sortBy: 'relevance'
})
```

## Components

### ForumList

Displays a hierarchical list of forums with stats and management options.

```tsx
<ForumList 
  parentId="parent-forum-id"  // Optional: show child forums
  showCreateButton={true}     // Show create forum button
  onForumClick={handleClick}  // Handle forum selection
  onCreateForum={handleCreate} // Handle forum creation
  className="custom-class"    // Custom CSS class
/>
```

### TopicList

Shows topics in a forum with filtering, sorting, and voting.

```tsx
<TopicList 
  forumId="forum-id"         // Required: forum to show topics from
  showCreateButton={true}    // Show create topic button
  onTopicClick={handleClick} // Handle topic selection
  onCreateTopic={handleCreate} // Handle topic creation
  className="custom-class"   // Custom CSS class
/>
```

### CommentThread

Displays nested comments with voting, replies, and moderation.

```tsx
<CommentThread 
  topicId="topic-id"        // Required: topic to show comments for
  allowReplies={true}       // Allow nested replies
  allowVoting={true}        // Show voting buttons
  allowModeration={false}   // Show moderation options
  maxDepth={5}              // Maximum nesting depth
  className="custom-class"  // Custom CSS class
/>
```

### UserProfile

Comprehensive user profile with stats, badges, and social features.

```tsx
<UserProfile 
  userId="user-id"          // Required: user to display
  currentUser={currentUser} // Current logged-in user
  onFollowChange={handleFollow} // Handle follow status changes
  className="custom-class"  // Custom CSS class
/>
```

### BadgeShowcase

Displays user badges and achievement progress.

```tsx
<BadgeShowcase 
  userId="user-id"          // Optional: show user's badges
  showProgress={true}       // Show progress towards badges
  limit={12}                // Limit number of badges shown
  className="custom-class"  // Custom CSS class
/>
```

## Types

The package exports comprehensive TypeScript types for all community features:

```tsx
import type {
  Forum,
  Topic,
  Comment,
  CommunityUser,
  Badge,
  UserBadge,
  Vote,
  Activity,
  CommunityNotification,
  Poll,
  CommunityEvent,
  Contest,
  SearchResult,
  CommunitySettings
} from '@repo/community'
```

## Styling

The package uses Tailwind CSS classes and integrates with the design system. You can customize the appearance by:

1. **CSS Classes**: Pass custom `className` props to components
2. **Design System**: Customize the underlying design system components
3. **Theme Variables**: Use CSS custom properties for colors and spacing

## Testing

The package includes comprehensive tests and testing utilities:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Configuration

### Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com
COMMUNITY_API_KEY=your-api-key

# Feature Flags
COMMUNITY_VOTING_ENABLED=true
COMMUNITY_BADGES_ENABLED=true
COMMUNITY_EVENTS_ENABLED=true
```

### Community Settings

```tsx
const settings: CommunitySettings = {
  general: {
    siteName: 'My Community',
    allowGuestViewing: true,
    requireEmailVerification: true
  },
  moderation: {
    autoModeration: true,
    spamFilterEnabled: true,
    maxReportsBeforeHide: 3
  },
  reputation: {
    enabled: true,
    postUpvotePoints: 10,
    solutionAcceptedPoints: 50
  },
  features: {
    forumsEnabled: true,
    votingEnabled: true,
    badgesEnabled: true,
    eventsEnabled: true
  }
}
```

## Real-time Features

The package supports real-time updates through WebSocket or Server-Sent Events:

```tsx
// Subscribe to topic updates
const unsubscribe = await communityService.subscribeToTopic(
  'topic-id',
  (data) => {
    console.log('Topic updated:', data)
  }
)

// Subscribe to user activity
const unsubscribeUser = await communityService.subscribeToUser(
  'user-id',
  (data) => {
    console.log('User activity:', data)
  }
)

// Clean up subscriptions
unsubscribe()
unsubscribeUser()
```

## Advanced Usage

### Custom Moderation

```tsx
// Report content
await communityService.reportContent(
  'topic',
  'topic-id',
  'spam',
  'This content appears to be spam'
)

// Moderate content (requires permissions)
await communityService.moderateContent(
  'topic',
  'topic-id',
  'lock',
  'Locking due to off-topic discussion'
)
```

### Badge Management

```tsx
// Award badge to user
await communityService.awardBadge('user-id', 'badge-id')

// Check badge progress
const progress = await communityService.checkBadgeProgress(
  'user-id',
  'badge-id'
)
```

### Event Management

```tsx
// Create community event
const event = await communityService.createEvent({
  title: 'Community Meetup',
  description: 'Monthly community meetup',
  type: 'meetup',
  startDate: new Date('2024-02-15'),
  endDate: new Date('2024-02-15'),
  isVirtual: true
})

// Register for event
await communityService.registerForEvent('event-id')
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 