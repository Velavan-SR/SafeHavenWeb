import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Award, Check, ChevronRight, User, X } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { quizQuestions } from "@/data/mockData"

interface MoveState {
  id: string
  isCorrect: boolean | null
  userAnswer: string | null
}

const selfDefenseMoves = quizQuestions.selfDefenseMoves

const SelfDefenseMoves: React.FC = () => {
  const navigate = useNavigate()
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [moveStates, setMoveStates] = useState<MoveState[]>(
    selfDefenseMoves.map((move) => ({
      id: move.id,
      isCorrect: null,
      userAnswer: null,
    })),
  )
  const [showResults, setShowResults] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [draggedTarget, setDraggedTarget] = useState<string | null>(null)

  const moves = selfDefenseMoves
  const currentMove = moves[currentMoveIndex]
  const progress = ((currentMoveIndex + 1) / moves.length) * 100

  // All possible targets
  const allTargets = ["nose or chin", "face or ribs", "groin or thigh", "grip escape"]

  // Check if current move has been answered
  const isCurrentMoveAnswered = () => {
    return moveStates[currentMoveIndex].userAnswer !== null
  }

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, target: string) => {
    setDraggedTarget(target)
  }

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedTarget && !isCurrentMoveAnswered()) {
      const isCorrect = draggedTarget === currentMove.target
      const updatedMoveStates = [...moveStates]
      updatedMoveStates[currentMoveIndex] = {
        ...updatedMoveStates[currentMoveIndex],
        isCorrect,
        userAnswer: draggedTarget,
      }
      setMoveStates(updatedMoveStates)

      // Add points if correct
      if (isCorrect) {
        setEarnedPoints(earnedPoints + 10)
        toast.success("Correct! +10 points")
      } else {
        toast.error("Not quite right. Try again next time!")
      }
    }
  }

  // Allow drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Move to next move
  const handleNext = () => {
    if (currentMoveIndex < moves.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1)
    } else {
      setShowResults(true)

      // Save points to localStorage
      const currentPoints = Number.parseInt(localStorage.getItem("defensePoints") || "0")
      localStorage.setItem("defensePoints", (currentPoints + earnedPoints).toString())

      toast.success(`Self-Defense Training Complete!`, {
        description: `You earned ${earnedPoints} points!`,
      })
    }
  }

  const handleReturnHome = () => {
    navigate("/games")
  }

  // Calculate correct answers
  const correctAnswers = moveStates.filter((state) => state.isCorrect).length

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <Button variant="ghost" onClick={handleReturnHome} className="mb-4 hover:bg-safehaven-soft-purple">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Activities
      </Button>

      <Card className="w-full">
        {!showResults ? (
          <>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-safehaven-primary">Self-Defense Moves</CardTitle>
                <div className="text-sm font-medium">
                  Move {currentMoveIndex + 1} of {moves.length}
                </div>
              </div>
              <CardDescription>Learn essential self-defense techniques</CardDescription>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="bg-safehaven-soft-purple p-4 rounded-lg mb-4">
                    <h3 className="font-bold text-lg mb-2">{currentMove.move}</h3>
                    <p className="text-sm">{currentMove.description}</p>
                  </div>

                  <div
                    className="border-2 border-dashed border-safehaven-primary rounded-lg p-6 min-h-[100px] flex items-center justify-center"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    {moveStates[currentMoveIndex].userAnswer ? (
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Target: {moveStates[currentMoveIndex].userAnswer}</span>
                        {moveStates[currentMoveIndex].isCorrect ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    ) : (
                      <p className="text-safehaven-neutral-gray text-center">
                        Drag and drop the correct target area for this move
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="font-medium mb-2">Target Areas:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {allTargets.map((target) => (
                      <div
                        key={target}
                        draggable={!isCurrentMoveAnswered()}
                        onDragStart={(e) => handleDragStart(e, target)}
                        className={`p-3 bg-white border rounded-lg cursor-grab flex items-center ${
                          isCurrentMoveAnswered() ? "opacity-50 cursor-not-allowed" : "hover:border-safehaven-primary"
                        }`}
                      >
                        <User className="h-4 w-4 mr-2 text-safehaven-primary" />
                        {target}
                      </div>
                    ))}
                  </div>

                  {moveStates[currentMoveIndex].isCorrect === false && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-700">
                        <strong>Correct target:</strong> {currentMove.target}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="text-sm text-safehaven-neutral-gray">Points: {earnedPoints}</div>
              <Button
                onClick={handleNext}
                disabled={!isCurrentMoveAnswered()}
                className="bg-safehaven-primary text-white"
              >
                {currentMoveIndex < moves.length - 1 ? "Next Move" : "Complete Training"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="mb-6">
              <Award className="h-16 w-16 text-safehaven-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-safehaven-primary">Training Complete!</h2>
              <p className="text-safehaven-neutral-gray mt-2">
                You matched {correctAnswers} out of {moves.length} moves correctly
              </p>
              <p className="text-safehaven-primary font-medium mt-2">Points earned: {earnedPoints}</p>
            </div>

            <div className="mb-8">
              {correctAnswers >= moves.length * 0.75 ? (
                <div className="text-green-600 font-medium">
                  Excellent! You have a good understanding of self-defense techniques.
                </div>
              ) : correctAnswers >= moves.length * 0.5 ? (
                <div className="text-yellow-600 font-medium">
                  Good effort! With more practice, you'll master these techniques.
                </div>
              ) : (
                <div className="text-safehaven-neutral-gray font-medium">
                  Keep practicing! Self-defense skills improve with repetition.
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={handleReturnHome} className="bg-safehaven-primary text-white">
                Return to Activities
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentMoveIndex(0)
                  setMoveStates(
                    selfDefenseMoves.map((move) => ({
                      id: move.id,
                      isCorrect: null,
                      userAnswer: null,
                    })),
                  )
                  setShowResults(false)
                  setEarnedPoints(0)
                }}
              >
                Retry Training
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default SelfDefenseMoves
