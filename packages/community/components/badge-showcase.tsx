'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, Award, Crown, Shield, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card'
import { Badge } from '@repo/design-system/components/ui/badge'
import { Progress } from '@repo/design-system/components/ui/progress'
import { Badge as BadgeType, UserBadge, BadgeTier } from '../lib/types'
import { communityService } from '../lib/community-service'

interface BadgeShowcaseProps {
  userId?: string
  showProgress?: boolean
  limit?: number
  className?: string
}

export function BadgeShowcase({ 
  userId, 
  showProgress = true, 
  limit,
  className 
}: BadgeShowcaseProps) {
  const [badges, setBadges] = useState<BadgeType[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBadges()
  }, [userId])

  const loadBadges = async () => {
    try {
      setLoading(true)
      
      const badgesResponse = await communityService.getBadges()
      if (badgesResponse.success) {
        setBadges(limit ? badgesResponse.data.slice(0, limit) : badgesResponse.data)
      }

      if (userId) {
        const userBadgesResponse = await communityService.getUserBadges(userId)
        if (userBadgesResponse.success) {
          setUserBadges(userBadgesResponse.data)
        }
      }
    } catch (err) {
      console.error('Error loading badges:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTierIcon = (tier: BadgeTier) => {
    switch (tier) {
      case 'bronze': return <Award className="h-4 w-4 text-amber-600" />
      case 'silver': return <Star className="h-4 w-4 text-gray-500" />
      case 'gold': return <Trophy className="h-4 w-4 text-yellow-500" />
      case 'platinum': return <Crown className="h-4 w-4 text-purple-500" />
      case 'legendary': return <Shield className="h-4 w-4 text-red-500" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getTierColor = (tier: BadgeTier) => {
    switch (tier) {
      case 'bronze': return 'border-amber-200 bg-amber-50'
      case 'silver': return 'border-gray-200 bg-gray-50'
      case 'gold': return 'border-yellow-200 bg-yellow-50'
      case 'platinum': return 'border-purple-200 bg-purple-50'
      case 'legendary': return 'border-red-200 bg-red-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const BadgeCard = ({ badge, userBadge }: { badge: BadgeType; userBadge?: UserBadge }) => {
    const isEarned = !!userBadge
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`relative ${isEarned ? '' : 'opacity-60'}`}
      >
        <Card className={`${getTierColor(badge.tier)} ${isEarned ? 'ring-2 ring-primary/20' : ''}`}>
          <CardContent className="p-4 text-center">
            <div className="relative mb-3">
              <div className="text-3xl mb-2">{badge.icon}</div>
              <div className="absolute -top-1 -right-1">
                {getTierIcon(badge.tier)}
              </div>
              {isEarned && (
                <div className="absolute -bottom-1 -right-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              )}
            </div>
            
            <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {badge.description}
            </p>
            
            <Badge variant="outline" className="text-xs">
              {badge.tier}
            </Badge>
            
            {userBadge && (
              <div className="text-xs text-muted-foreground mt-2">
                Earned {new Date(userBadge.earnedAt).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3" />
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded mb-2" />
              <div className="h-5 bg-muted rounded w-16 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const earnedBadges = userBadges.map(ub => ub.badge.id)

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {badges.map(badge => {
          const userBadge = userBadges.find(ub => ub.badge.id === badge.id)
          return (
            <BadgeCard 
              key={badge.id} 
              badge={badge} 
              userBadge={userBadge}
            />
          )
        })}
      </div>
      
      {userId && showProgress && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Badge Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Badges Earned</span>
                <span>{userBadges.length} / {badges.length}</span>
              </div>
              <Progress 
                value={(userBadges.length / badges.length) * 100} 
                className="w-full"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                {['bronze', 'silver', 'gold', 'platinum', 'legendary'].map(tier => {
                  const tierBadges = badges.filter(b => b.tier === tier)
                  const earnedTierBadges = userBadges.filter(ub => ub.badge.tier === tier)
                  
                  return (
                    <div key={tier} className="space-y-1">
                      <div className="flex justify-center">
                        {getTierIcon(tier as BadgeTier)}
                      </div>
                      <div className="text-xs font-medium capitalize">{tier}</div>
                      <div className="text-xs text-muted-foreground">
                        {earnedTierBadges.length} / {tierBadges.length}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 