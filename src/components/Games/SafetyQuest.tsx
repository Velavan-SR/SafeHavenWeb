import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ChevronRight, Star, Trophy, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
// Add GameProgressManager to update overall progress
// Add this import at the top:
import GameProgressManager from "./GameProgressManager"

interface Scenario {
  id: number
  situation: string
  options: {
    text: string
    isCorrect: boolean
    explanation: string
  }[]
  difficulty: "Easy" | "Medium" | "Hard"
  points: number
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    situation: "You're walking alone and someone starts following you. What should you do?",
    options: [
      {
        text: "Call a trusted friend or family member and stay on the line",
        isCorrect: false,
        explanation: "While calling someone is good, there's a better immediate action.",
      },
      {
        text: "Use SafeHaven SOS to alert emergency contacts and authorities",
        isCorrect: true,
        explanation: "This is the best option as it alerts multiple people and shares your location.",
      },
      {
        text: "Ignore them and continue walking",
        isCorrect: false,
        explanation: "Ignoring the situation could be dangerous.",
      },
    ],
    difficulty: "Easy",
    points: 10,
  },
  {
    id: 2,
    situation: "Someone offers you a ride home. What should you do first?",
    options: [
      {
        text: "Ask for their name and details",
        isCorrect: false,
        explanation: "Names can be falsified. There's a safer approach.",
      },
      {
        text: "Check their ID and share their details with a trusted contact",
        isCorrect: true,
        explanation: "Always verify identity and let others know your situation.",
      },
      {
        text: "Accept if they seem friendly",
        isCorrect: false,
        explanation: "Appearances can be deceiving. Never judge by friendliness alone.",
      },
    ],
    difficulty: "Medium",
    points: 15,
  },
  // Add more scenarios here...
]

const SafetyQuest: React.FC = () => {
  const navigate = useNavigate()
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [stars, setStars] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)

  useEffect(() => {
    // Load previous progress if any
    const savedProgress = localStorage.getItem("safetyQuestProgress")
    if (savedProgress) {
      const { currentScenario, score, stars } = JSON.parse(savedProgress)
      setCurrentScenario(currentScenario)
      setScore(score)
      setStars(stars)
    }
  }, [])

  const saveProgress = () => {
    const progress = {
      currentScenario,
      score,
      stars,
    }
    localStorage.setItem("safetyQuestProgress", JSON.stringify(progress))

    // Update overall game progress
    const gameProgress = JSON.parse(localStorage.getItem("gameProgress") || "{}")
    gameProgress.safetyQuest = {
      completed: gameCompleted,
      score,
      stars,
      badges: stars >= 3 ? ["Safety Expert"] : [],
    }
    localStorage.setItem("gameProgress", JSON.stringify(gameProgress))
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null || showExplanation) return

    setSelectedOption(optionIndex)
    const correct = SCENARIOS[currentScenario].options[optionIndex].isCorrect

    if (correct) {
      setScore(score + SCENARIOS[currentScenario].points)
      toast.success("Correct choice! Well done!")
    } else {
      toast.error("That might not be the safest choice.")
    }

    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentScenario === SCENARIOS.length - 1) {
      // Calculate stars based on score
      const newStars = Math.floor((score / (SCENARIOS.length * 10)) * 3)
      setStars(newStars)
      setGameCompleted(true)
      saveProgress()
    } else {
      setCurrentScenario(currentScenario + 1)
      setSelectedOption(null)
      setShowExplanation(false)
    }
  }

  const handleRestart = () => {
    setCurrentScenario(0)
    setScore(0)
    setStars(0)
    setSelectedOption(null)
    setShowExplanation(false)
    setGameCompleted(false)
  }

  if (gameCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Quest Completed!</h2>
          <div className="flex justify-center space-x-2 mb-4">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className={`h-8 w-8 ${i < stars ? "text-yellow-500" : "text-gray-300"}`} />
            ))}
          </div>
          <p className="text-xl mb-4">Final Score: {score}</p>
          {stars >= 3 && (
            <div className="mb-4">
              <Badge className="bg-safehaven-primary">
                <Trophy className="h-4 w-4 mr-2" />
                Safety Expert Badge Earned!
              </Badge>
            </div>
          )}
          <div className="space-x-4">
            <Button onClick={handleRestart}>Play Again</Button>
            <Button variant="outline" onClick={() => navigate("/games")}>
              Back to Games
            </Button>
          </div>
          {gameCompleted && (
            <GameProgressManager
              gameId="safety-quest"
              points={score}
              completed={true}
              stars={stars}
              badges={stars >= 3 ? ["Safety Expert"] : []}
            />
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/games")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Games
        </Button>
        <div className="flex items-center space-x-4">
          <Badge variant="outline">Score: {score}</Badge>
          <Progress value={(currentScenario / SCENARIOS.length) * 100} className="w-32" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <Badge
              className={`mb-2 ${
                SCENARIOS[currentScenario].difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : SCENARIOS[currentScenario].difficulty === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {SCENARIOS[currentScenario].difficulty}
            </Badge>
            <h2 className="text-xl font-semibold mb-4">{SCENARIOS[currentScenario].situation}</h2>
          </div>

          <div className="space-y-4">
            {SCENARIOS[currentScenario].options.map((option, index) => (
              <Button
                key={index}
                variant={selectedOption === index ? (option.isCorrect ? "default" : "destructive") : "outline"}
                className="w-full justify-start text-left"
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOption !== null}
              >
                {option.text}
              </Button>
            ))}
          </div>

          {showExplanation && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                SCENARIOS[currentScenario].options[selectedOption!].isCorrect
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start">
                <AlertCircle
                  className={`h-5 w-5 mr-2 ${
                    SCENARIOS[currentScenario].options[selectedOption!].isCorrect ? "text-green-500" : "text-red-500"
                  }`}
                />
                <p className="text-sm">{SCENARIOS[currentScenario].options[selectedOption!].explanation}</p>
              </div>
              <Button className="mt-4" onClick={handleNext}>
                {currentScenario === SCENARIOS.length - 1 ? "Complete Quest" : "Next Scenario"}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SafetyQuest