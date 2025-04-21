import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, BookOpen, Play, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { Progress } from "@/components/ui/progress"

interface GameCardProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  duration: string
  path: string
  forUserType: string[]
  progress?: {
    completed: boolean
    score: number
    stars: number
    badges: string[]
  }
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  description,
  icon,
  category,
  difficulty,
  duration,
  path,
  progress,
}) => {
  const navigate = useNavigate()

  // Map difficulty to color
  const difficultyColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800",
  }

  const handlePlay = () => {
    navigate(path)
  }

  // Calculate progress percentage if available
  const progressPercentage = progress ? Math.min(100, Math.round((progress.score / 100) * 100)) : 0

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-2 bg-gradient-to-r from-safehaven-primary to-safehaven-secondary`} />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="p-2 mr-3 bg-safehaven-soft-purple rounded-lg">{icon}</div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge className={difficultyColor[difficulty]}>{difficulty}</Badge>
        </div>
        <CardDescription className="text-safehaven-neutral-gray">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex items-center space-x-2 text-sm mb-2">
          <Badge variant="outline" className="rounded-full">
            <BookOpen className="h-3 w-3 mr-1" />
            {category}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            <Award className="h-3 w-3 mr-1" />
            Earn points
          </Badge>
        </div>

        {progress && (
          <div className="mt-3 mb-1">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
            {progress.stars > 0 && (
              <div className="flex mt-2 justify-center">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < progress.stars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-safehaven-neutral-gray mt-2">Estimated time: {duration}</div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button onClick={handlePlay} className="w-full bg-safehaven-primary hover:bg-safehaven-secondary text-white">
          <Play className="h-4 w-4 mr-1" />
          {progress?.completed ? "Play Again" : "Start Activity"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default GameCard