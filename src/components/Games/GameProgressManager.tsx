import type React from "react"
import { useEffect } from "react"

const GameProgressManager: React.FC<{
  gameId: string
  points: number
  completed: boolean
  stars: number
  badges: string[]
}> = ({ gameId, points, completed, stars, badges }) => {
  useEffect(() => {
    // Get current progress
    const storedProgress = localStorage.getItem("gameProgress")
    const gameProgress = storedProgress
      ? JSON.parse(storedProgress)
      : {
          totalStars: 0,
          totalBadges: [],
          gameProgress: {},
          level: 1,
          experience: 0,
        }

    // Update game-specific progress
    if (!gameProgress.gameProgress) {
      gameProgress.gameProgress = {}
    }

    gameProgress.gameProgress[gameId] = {
      completed,
      score: points,
      stars,
      badges,
    }

    // Update total stars
    let totalStars = 0
    Object.values(gameProgress.gameProgress).forEach((game: any) => {
      totalStars += game.stars || 0
    })
    gameProgress.totalStars = totalStars

    // Update total badges
    const allBadges: string[] = []
    Object.values(gameProgress.gameProgress).forEach((game: any) => {
      if (game.badges && Array.isArray(game.badges)) {
        allBadges.push(...game.badges)
      }
    })
    gameProgress.totalBadges = [...new Set(allBadges)] // Remove duplicates

    // Update experience and level
    const newExperience = gameProgress.experience + Math.floor(points / 10)
    const levelIncrease = Math.floor(newExperience / 100)

    if (levelIncrease > 0) {
      gameProgress.level += levelIncrease
      gameProgress.experience = newExperience % 100
    } else {
      gameProgress.experience = newExperience
    }

    // Save updated progress
    localStorage.setItem("gameProgress", JSON.stringify(gameProgress))

    // Trigger storage event for other components to update
    window.dispatchEvent(new Event("storage"))
  }, [gameId, points, completed, stars, badges])

  return null // This component doesn't render anything
}

export default GameProgressManager