import type React from "react"
import { useState, useEffect } from "react"
import GameCard from "./GameCard"
import { BookOpen, Brain, Map, MessageCircle, Shield, Star, User, Flower } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy } from "lucide-react"
import type { UserGameData } from "@/types"

const GamesList: React.FC = () => {
  // Fix the userType filtering logic to properly display all games
  // Get user type from localStorage with fallback
  const userType = localStorage.getItem("userType") || "both"

  // Initialize user game data from localStorage
  const [userData, setUserData] = useState<UserGameData>(() => {
    const stored = localStorage.getItem("gameProgress")
    try {
      const parsed = stored ? JSON.parse(stored) : null
      return parsed && parsed.totalBadges
        ? parsed
        : {
            totalStars: 0,
            totalBadges: [],
            gameProgress: {},
            level: 1,
            experience: 0,
          }
    } catch {
      return {
        totalStars: 0,
        totalBadges: [],
        gameProgress: {},
        level: 1,
        experience: 0,
      }
    }
  })

  // Update userData when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("gameProgress")
      if (stored) {
        setUserData(JSON.parse(stored))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Add a useEffect to update the level when experience exceeds 100%
  useEffect(() => {
    // Check if experience exceeds 100 and update level accordingly
    if (userData.experience >= 100) {
      const newLevel = userData.level + Math.floor(userData.experience / 100)
      const newExperience = userData.experience % 100

      // Update localStorage with new level and experience
      const updatedUserData = {
        ...userData,
        level: newLevel,
        experience: newExperience,
      }

      localStorage.setItem("gameProgress", JSON.stringify(updatedUserData))
      setUserData(updatedUserData)
    }
  }, [userData.experience, userData])

  // Ensure all games are properly defined with correct forUserType arrays
  const allGames = [
    {
      id: "safety-quest",
      title: "Safety Quest",
      description: "Navigate through scenarios and learn how to stay safe in different situations.",
      icon: <Shield className="h-5 w-5 text-safehaven-primary" />,
      category: "Scenarios",
      difficulty: "Easy" as const,
      duration: "5-10 min",
      path: "/games/safety-quest",
      forUserType: ["woman", "child", "both", "admin"],
    },
    {
      id: "brain-booster",
      title: "Brain Booster Quiz",
      description: "Test your knowledge on safety, rights, and legal protection with 25 questions.",
      icon: <Brain className="h-5 w-5 text-safehaven-primary" />,
      category: "Quiz",
      difficulty: "Medium" as const,
      duration: "10-15 min",
      path: "/games/brain-booster",
      forUserType: ["woman", "child", "both", "admin"],
    },
    {
      id: "self-defense",
      title: "Self-Defense Moves",
      description: "Learn essential self-defense techniques with step-by-step instructions.",
      icon: <User className="h-5 w-5 text-safehaven-primary" />,
      category: "Physical",
      difficulty: "Medium" as const,
      duration: "15-20 min",
      path: "/games/self-defense",
      forUserType: ["woman", "both", "admin"],
    },
    {
      id: "voice-challenge",
      title: "Voice Challenge",
      description: "Practice voice commands for emergency situations with AI feedback.",
      icon: <MessageCircle className="h-5 w-5 text-safehaven-primary" />,
      category: "Interactive",
      difficulty: "Easy" as const,
      duration: "5 min",
      path: "/games/voice-challenge",
      forUserType: ["woman", "child", "both", "admin"],
    },
    {
      id: "memory-game",
      title: "Know Your Rights",
      description: "Match cards to learn about important laws and rights protecting you.",
      icon: <BookOpen className="h-5 w-5 text-safehaven-primary" />,
      category: "Memory",
      difficulty: "Easy" as const,
      duration: "5-10 min",
      path: "/games/memory-game",
      forUserType: ["woman", "child", "both", "admin"],
    },
    {
      id: "map-hunt",
      title: "Map Hunt: Escape to Safety",
      description: "Navigate virtual maps to find safe zones and escape dangerous situations.",
      icon: <Map className="h-5 w-5 text-safehaven-primary" />,
      category: "Navigation",
      difficulty: "Medium" as const,
      duration: "10 min",
      path: "/games/map-hunt",
      forUserType: ["woman", "child", "both", "admin"],
    },
    {
      id: "roleplay-adventure",
      title: "Roleplay Adventure",
      description: "Play different roles in emergency scenarios to understand how to respond.",
      icon: <Star className="h-5 w-5 text-safehaven-primary" />,
      category: "Roleplay",
      difficulty: "Hard" as const,
      duration: "15 min",
      path: "/games/roleplay",
      forUserType: ["woman", "both", "admin"],
    },
    {
      id: "relaxation-zone",
      title: "Relaxation Zone",
      description: "Guided breathing exercises and relaxation techniques to reduce stress.",
      icon: <Flower className="h-5 w-5 text-safehaven-primary" />,
      category: "Wellness",
      difficulty: "Easy" as const,
      duration: "5-10 min",
      path: "/games/relaxation",
      forUserType: ["woman", "child", "both", "admin"],
    },
  ]

  // Filter games based on user type
  // Modified to show all games if userType is "both" or admin
  const filteredGames =
    userType === "both" || userType === "admin"
      ? allGames
      : allGames.filter((game) => game.forUserType.includes(userType))

  return (
    <div className="w-full space-y-8">
      {/* User Progress Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-safehaven-primary">Level {userData.level}</h2>
            <p className="text-safehaven-neutral-gray">{userData.totalStars} Stars Earned</p>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>{userData.totalBadges.length} Badges</span>
          </div>
        </div>
        <div className="relative">
          <Progress value={userData.experience} max={100} className="h-2" />
          <div className="text-xs text-safehaven-neutral-gray mt-1 text-right">
            {userData.experience}% to Level {userData.level + 1}
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-safehaven-primary">Gamified Activities</h2>
        <p className="text-safehaven-neutral-gray">
          Learn essential safety skills and knowledge through interactive activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <GameCard key={game.id} {...game} progress={userData.gameProgress && userData.gameProgress[game.id]} />
        ))}
      </div>
    </div>
  )
}

export default GamesList