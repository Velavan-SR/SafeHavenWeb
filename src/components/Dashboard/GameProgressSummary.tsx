import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Award } from "lucide-react"
import type { UserGameData } from "@/types"

const GameProgressSummary: React.FC = () => {
  const [userData, setUserData] = useState<UserGameData | null>(null)

  useEffect(() => {
    // Get user game data
    const storedProgress = localStorage.getItem("gameProgress")
    if (storedProgress) {
        const parsed = JSON.parse(storedProgress)
        setUserData({
        level: 1,
        totalStars: 0,
        totalBadges: [],
        experience: 0,
        gameProgress: {},
        ...parsed, 
    })
    }

    // Listen for changes
    const handleStorageChange = () => {
      const updated = localStorage.getItem("gameProgress")
      if (updated) {
        setUserData(JSON.parse(updated))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  if (!userData) return null

  // Calculate completion percentage
  const totalGames = 8 // Total number of games in the app
  const completedGames = Object.values(userData.gameProgress || {}).filter((game) => game.completed).length
  const completionPercentage = Math.round((completedGames / totalGames) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
        <CardDescription>Track your learning journey</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span className="font-medium">Level {userData.level}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>{userData.totalStars} Stars</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-safehaven-primary" />
            <span>{userData.totalBadges.length} Badges</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Level Progress</span>
            <span className="text-sm">{userData.experience}%</span>
          </div>
          <Progress value={userData.experience} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm">Activities Completed</span>
            <span className="text-sm">
              {completedGames}/{totalGames}
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}

export default GameProgressSummary