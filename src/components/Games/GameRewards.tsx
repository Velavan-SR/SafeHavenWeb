import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Star, Trophy } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { UserGameData } from "@/types"

interface GameRewardsProps {
  gameId: string
  score: number
  onClose: () => void
}

const GameRewards: React.FC<GameRewardsProps> = ({ gameId, score, onClose }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [userData, setUserData] = useState<UserGameData | null>(null)
  const [earnedBadges, setEarnedBadges] = useState<string[]>([])
  const [earnedStars, setEarnedStars] = useState(0)

  useEffect(() => {
    // Get user game data
    const storedProgress = localStorage.getItem("gameProgress")
    if (storedProgress) {
      const gameProgress: UserGameData = JSON.parse(storedProgress)
      setUserData(gameProgress)

      // Calculate stars based on score
      let stars = 0
      if (score >= 80) stars = 3
      else if (score >= 60) stars = 2
      else if (score >= 40) stars = 1

      setEarnedStars(stars)

      // Determine badges
      const badges: string[] = []
      if (score >= 90) badges.push("Expert")
      else if (score >= 70) badges.push("Advanced")
      else if (score >= 50) badges.push("Intermediate")
      else badges.push("Beginner")

      // Add first-time badge
      if (!gameProgress.gameProgress[gameId]) {
        badges.push("First Timer")
      }

      setEarnedBadges(badges)
    }
  }, [gameId, score])

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  if (!userData) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Game Rewards</DialogTitle>
          <DialogDescription className="text-center">Congratulations on completing the game!</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Stars */}
          <div className="text-center">
            <h3 className="font-medium mb-2">Stars Earned</h3>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 ${star <= earnedStars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="text-center">
            <h3 className="font-medium mb-2">Badges Earned</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {earnedBadges.map((badge) => (
                <Card key={badge} className="w-24 h-24 flex flex-col items-center justify-center">
                  <Award className="h-8 w-8 text-safehaven-primary" />
                  <p className="text-xs mt-1">{badge}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="text-center">
            <h3 className="font-medium mb-2">Current Level</h3>
            <div className="flex justify-center items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span className="text-xl font-bold">Level {userData.level}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={handleClose}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default GameRewards