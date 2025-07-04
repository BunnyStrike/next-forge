'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Mail,
  MessageCircle,
  Heart,
  Trophy,
  Star,
  Users,
  Activity,
  Settings,
  Shield,
  Eye,
  EyeOff,
  UserPlus,
  UserMinus,
  Share,
  Flag,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '@repo/design-system/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card'
import { Badge } from '@repo/design-system/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/design-system/components/ui/tabs'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@repo/design-system/components/ui/dropdown-menu'
import { Separator } from '@repo/design-system/components/ui/separator'
import { formatDistanceToNow, format } from 'date-fns'
import { CommunityUser, Activity as ActivityType, UserBadge, UserFollow } from '../lib/types'
import { communityService } from '../lib/community-service'

interface UserProfileProps {
  userId: string
  currentUser?: CommunityUser
  onFollowChange?: (isFollowing: boolean) => void
  className?: string
}

export function UserProfile({ 
  userId, 
  currentUser,
  onFollowChange,
  className 
}: UserProfileProps) {
  const [user, setUser] = useState<CommunityUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activity, setActivity] = useState<ActivityType[]>([])
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [followers, setFollowers] = useState<UserFollow[]>([])
  const [following, setFollowing] = useState<UserFollow[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadUserData()
  }, [userId])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Load user profile
      const userResponse = await communityService.getUser(userId)
      if (userResponse.success) {
        setUser(userResponse.data)
      }

      // Load user activity
      const activityResponse = await communityService.getUserActivity(userId)
      if (activityResponse.success) {
        setActivity(activityResponse.data)
      }

      // Load user badges
      const badgesResponse = await communityService.getUserBadges(userId)
      if (badgesResponse.success) {
        setBadges(badgesResponse.data)
      }

      // Load followers/following
      const [followersResponse, followingResponse] = await Promise.all([
        communityService.getFollowers(userId),
        communityService.getFollowing(userId)
      ])
      
      if (followersResponse.success) setFollowers(followersResponse.data)
      if (followingResponse.success) setFollowing(followingResponse.data)

      // Check if current user is following this user
      if (currentUser && followersResponse.success) {
        setIsFollowing(followersResponse.data.some(f => f.followerId === currentUser.id))
      }

    } catch (err) {
      setError('Failed to load user profile')
      console.error('Error loading user data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    if (!currentUser || !user) return

    try {
      if (isFollowing) {
        await communityService.unfollowUser(user.id)
      } else {
        await communityService.followUser(user.id)
      }
      
      setIsFollowing(!isFollowing)
      onFollowChange?.(!isFollowing)
      
      // Reload followers list
      const followersResponse = await communityService.getFollowers(userId)
      if (followersResponse.success) {
        setFollowers(followersResponse.data)
      }
    } catch (err) {
      console.error('Error following/unfollowing user:', err)
    }
  }

  const StatCard = ({ icon: Icon, label, value, description }: {
    icon: React.ElementType
    label: string
    value: string | number
    description?: string
  }) => (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
        {description && (
          <div className="text-xs text-muted-foreground mt-1">{description}</div>
        )}
      </CardContent>
    </Card>
  )

  const BadgeGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map(userBadge => (
        <motion.div
          key={userBadge.id}
          whileHover={{ scale: 1.05 }}
          className="text-center"
        >
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="text-2xl mb-2">{userBadge.badge.icon}</div>
            <h4 className="font-medium text-sm">{userBadge.badge.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {userBadge.badge.description}
            </p>
            <div className="text-xs text-muted-foreground mt-2">
              Earned {formatDistanceToNow(userBadge.earnedAt, { addSuffix: true })}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const ActivityFeed = () => (
    <div className="space-y-4">
      {activity.map(item => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{item.description}</p>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const SocialConnections = () => (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-3">Followers ({followers.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {followers.slice(0, 6).map(follow => (
            <Card key={follow.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={follow.follower.avatar} />
                    <AvatarFallback>
                      {follow.follower.displayName?.[0] || follow.follower.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {follow.follower.displayName || follow.follower.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {follow.follower.reputation} reputation
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-3">Following ({following.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {following.slice(0, 6).map(follow => (
            <Card key={follow.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={follow.following.avatar} />
                    <AvatarFallback>
                      {follow.following.displayName?.[0] || follow.following.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {follow.following.displayName || follow.following.username}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {follow.following.reputation} reputation
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-muted rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !user) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-destructive mb-4">{error || 'User not found'}</p>
          <Button onClick={loadUserData} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isOwnProfile = currentUser?.id === user.id

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.displayName?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex items-center gap-2 mb-2">
                {user.isOnline && (
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                )}
                <span className="text-sm text-muted-foreground">
                  {user.isOnline ? 'Online' : `Last seen ${formatDistanceToNow(user.lastActiveAt || user.joinedAt, { addSuffix: true })}`}
                </span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    {user.displayName || user.username}
                    {user.isVerified && (
                      <Shield className="h-5 w-5 text-primary" />
                    )}
                  </h1>
                  {user.displayName && (
                    <p className="text-muted-foreground">@{user.username}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {!isOwnProfile && currentUser && (
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? 'outline' : 'default'}
                      size="sm"
                    >
                      {isFollowing ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 mr-2" />
                        Share Profile
                      </DropdownMenuItem>
                      {!isOwnProfile && (
                        <>
                          <DropdownMenuItem>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Flag className="h-4 w-4 mr-2" />
                            Report User
                          </DropdownMenuItem>
                        </>
                      )}
                      {isOwnProfile && (
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {user.bio && (
                <p className="text-muted-foreground mb-4">{user.bio}</p>
              )}

              {/* Profile Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {format(user.joinedAt, 'MMM yyyy')}</span>
                </div>
                
                {user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                
                {user.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              {/* Level and Reputation */}
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="text-sm">
                  Level {user.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{user.reputation} reputation</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={MessageCircle}
          label="Posts"
          value={user.stats.postsCount}
          description="Topics created"
        />
        <StatCard
          icon={Heart}
          label="Likes"
          value={user.stats.likesReceived}
          description="Received from others"
        />
        <StatCard
          icon={Users}
          label="Followers"
          value={user.stats.followersCount}
          description="People following"
        />
        <StatCard
          icon={Star}
          label="Solutions"
          value={user.stats.solutionsAccepted}
          description="Accepted answers"
        />
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="badges">Badges ({badges.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {badges.slice(0, 4).map(userBadge => (
                    <div key={userBadge.id} className="text-center p-3 border rounded-lg">
                      <div className="text-xl mb-1">{userBadge.badge.icon}</div>
                      <div className="text-xs font-medium">{userBadge.badge.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activity.slice(0, 5).map(item => (
                    <div key={item.id} className="flex gap-2">
                      <Activity className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p>{item.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>All Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <BadgeGrid />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <SocialConnections />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 