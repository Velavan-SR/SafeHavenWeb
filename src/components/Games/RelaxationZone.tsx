import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Flower, Heart, Moon, Pause, Play, Volume2 } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
// Add GameProgressManager to update overall progress
import GameProgressManager from "./GameProgressManager"

const RelaxationZone: React.FC = () => {
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("breathing")
  const [isExerciseActive, setIsExerciseActive] = useState(false)
  const [exerciseTime, setExerciseTime] = useState(0)
  const [maxExerciseTime, setMaxExerciseTime] = useState(120) // 2 minutes in seconds
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("rest")
  const [breathProgress, setBreathProgress] = useState(0)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<string[]>([])
  const timerRef = useRef<number | null>(null)

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Start exercise
  const startExercise = () => {
    setIsExerciseActive(true)
    setExerciseTime(0)

    // Start timer
    timerRef.current = window.setInterval(() => {
      setExerciseTime((prev) => {
        const newTime = prev + 1

        // Update breath phase for breathing exercise
        if (selectedTab === "breathing") {
          const totalCycle = 13 // 4 + 1 + 6 + 2
          const cyclePosition = newTime % totalCycle

          if (cyclePosition < 4) {
            setBreathPhase("inhale")
            setBreathProgress((cyclePosition / 4) * 100)
          } else if (cyclePosition < 5) {
            setBreathPhase("hold")
            setBreathProgress(100)
          } else if (cyclePosition < 11) {
            setBreathPhase("exhale")
            setBreathProgress(100 - ((cyclePosition - 5) / 6) * 100)
          } else {
            setBreathPhase("rest")
            setBreathProgress(0)
          }
        }

        // Check if exercise is complete
        if (newTime >= maxExerciseTime) {
          completeExercise()
          return maxExerciseTime
        }

        return newTime
      })
    }, 1000)
  }

  // Pause exercise
  const pauseExercise = () => {
    setIsExerciseActive(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Complete exercise
  const completeExercise = () => {
    pauseExercise()

    // Add points
    const pointsEarned = 20
    setEarnedPoints(earnedPoints + pointsEarned)

    // Mark as completed
    if (!completedExercises.includes(selectedTab)) {
      setCompletedExercises([...completedExercises, selectedTab])
    }

    // Save points to localStorage
    const currentPoints = Number.parseInt(localStorage.getItem("relaxationPoints") || "0")
    localStorage.setItem("relaxationPoints", (currentPoints + pointsEarned).toString())

    toast.success(`Exercise Complete!`, {
      description: `You earned ${pointsEarned} points!`,
    })

    // Update overall game progress
    GameProgressManager({
      gameId: "relaxation-zone",
      points: pointsEarned,
      completed: true,
      stars: completedExercises.length >= 3 ? 3 : completedExercises.length >= 2 ? 2 : 1,
      badges: [completedExercises.length >= 3 ? "Relaxation Master" : "Stress Reducer"],
    })
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    // Pause current exercise if active
    if (isExerciseActive) {
      pauseExercise()
    }

    setSelectedTab(value)
    setExerciseTime(0)
    setBreathPhase("rest")
    setBreathProgress(0)

    // Set max time based on exercise
    switch (value) {
      case "breathing":
        setMaxExerciseTime(120) // 2 minutes
        break
      case "meditation":
        setMaxExerciseTime(180) // 3 minutes
        break
      case "affirmations":
        setMaxExerciseTime(90) // 1.5 minutes
        break
      default:
        setMaxExerciseTime(120)
    }
  }

  const handleReturnHome = () => {
    pauseExercise()
    navigate("/games")
  }

  // Render breathing exercise
  const renderBreathingExercise = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold mb-2">Deep Breathing</h3>
          <p className="text-safehaven-neutral-gray">Follow the circle to regulate your breathing</p>
        </div>

        <div className="relative mb-8">
          <div
            className={`w-64 h-64 rounded-full border-4 transition-all duration-300 flex items-center justify-center ${
              breathPhase === "rest"
                ? "border-gray-200"
                : breathPhase === "inhale"
                  ? "border-blue-400 scale-110"
                  : breathPhase === "hold"
                    ? "border-green-400 scale-110"
                    : "border-purple-400 scale-100"
            }`}
          >
            <div
              className={`w-48 h-48 rounded-full transition-all duration-300 flex items-center justify-center text-white font-bold ${
                breathPhase === "rest"
                  ? "bg-gray-200"
                  : breathPhase === "inhale"
                    ? "bg-blue-400 scale-110"
                    : breathPhase === "hold"
                      ? "bg-green-400 scale-110"
                      : "bg-purple-400 scale-100"
              }`}
            >
              {breathPhase === "rest"
                ? "Ready..."
                : breathPhase === "inhale"
                  ? "Inhale"
                  : breathPhase === "hold"
                    ? "Hold"
                    : "Exhale"}
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-safehaven-neutral-gray mb-2">
            Inhale for 4 seconds, hold for 1 second, exhale for 6 seconds, rest for 2 seconds
          </p>
          <p className="text-sm font-medium">
            Time: {Math.floor(exerciseTime / 60)}:{(exerciseTime % 60).toString().padStart(2, "0")} /{" "}
            {Math.floor(maxExerciseTime / 60)}:{(maxExerciseTime % 60).toString().padStart(2, "0")}
          </p>
        </div>
      </div>
    )
  }

  // Render guided meditation
  const renderGuidedMeditation = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold mb-2">Guided Meditation</h3>
          <p className="text-safehaven-neutral-gray">Close your eyes and follow the guided instructions</p>
        </div>

        <div className="mb-8 text-center">
          <Moon className="h-24 w-24 text-safehaven-primary mx-auto mb-4" />
          <p className="text-safehaven-neutral-gray mb-4">
            Find a comfortable position. Close your eyes and focus on your breathing.
          </p>
          <Button variant="outline" className="mb-4">
            <Volume2 className="h-4 w-4 mr-2" />
            Play Audio (Simulated)
          </Button>
        </div>

        <div className="w-full max-w-md">
          <Progress value={(exerciseTime / maxExerciseTime) * 100} className="h-2 mb-2" />
          <p className="text-sm font-medium text-center">
            Time: {Math.floor(exerciseTime / 60)}:{(exerciseTime % 60).toString().padStart(2, "0")} /{" "}
            {Math.floor(maxExerciseTime / 60)}:{(maxExerciseTime % 60).toString().padStart(2, "0")}
          </p>
        </div>
      </div>
    )
  }

  // Render positive affirmations
  const renderPositiveAffirmations = () => {
    const affirmations = [
      "I am safe and protected",
      "I trust my instincts",
      "I am strong and capable",
      "I deserve respect and kindness",
      "I have the power to make good choices",
      "I am surrounded by support",
      "I can handle difficult situations",
      "I am worthy of love and respect",
    ]

    const currentAffirmation = affirmations[Math.floor((exerciseTime / maxExerciseTime) * affirmations.length)]

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="mb-8 text-center">
          <h3 className="text-xl font-bold mb-2">Positive Affirmations</h3>
          <p className="text-safehaven-neutral-gray">Repeat these affirmations to yourself</p>
        </div>

        <div className="mb-8">
          <div className="bg-safehaven-soft-purple p-8 rounded-lg text-center">
            <Heart className="h-12 w-12 text-safehaven-primary mx-auto mb-4" />
            <p className="text-xl font-bold text-safehaven-primary">{currentAffirmation}</p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <Progress value={(exerciseTime / maxExerciseTime) * 100} className="h-2 mb-2" />
          <p className="text-sm font-medium text-center">
            Time: {Math.floor(exerciseTime / 60)}:{(exerciseTime % 60).toString().padStart(2, "0")} /{" "}
            {Math.floor(maxExerciseTime / 60)}:{(maxExerciseTime % 60).toString().padStart(2, "0")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Button variant="ghost" onClick={handleReturnHome} className="mb-4 hover:bg-safehaven-soft-purple">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Activities
      </Button>

      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl text-safehaven-primary">Relaxation Zone</CardTitle>
              <CardDescription>Reduce stress with calming activities and exercises</CardDescription>
            </div>
            <div className="text-sm font-medium">
              Points: <span className="text-safehaven-primary">{earnedPoints}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="breathing">Deep Breathing</TabsTrigger>
              <TabsTrigger value="meditation">Guided Meditation</TabsTrigger>
              <TabsTrigger value="affirmations">Positive Affirmations</TabsTrigger>
            </TabsList>

            <TabsContent value="breathing" className="pt-6">
              {renderBreathingExercise()}
            </TabsContent>

            <TabsContent value="meditation" className="pt-6">
              {renderGuidedMeditation()}
            </TabsContent>

            <TabsContent value="affirmations" className="pt-6">
              {renderPositiveAffirmations()}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-center">
          {isExerciseActive ? (
            <Button onClick={pauseExercise} variant="outline" className="w-40">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button onClick={startExercise} className="w-40 bg-safehaven-primary text-white">
              <Play className="h-4 w-4 mr-2" />
              {exerciseTime > 0 ? "Resume" : "Start"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Benefits of Relaxation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-safehaven-soft-purple p-4 rounded-lg">
              <Flower className="h-6 w-6 text-safehaven-primary mb-2" />
              <h3 className="font-bold mb-1">Reduces Stress</h3>
              <p className="text-sm text-safehaven-neutral-gray">
                Regular relaxation practices lower cortisol levels and reduce anxiety.
              </p>
            </div>
            <div className="bg-safehaven-soft-purple p-4 rounded-lg">
              <Heart className="h-6 w-6 text-safehaven-primary mb-2" />
              <h3 className="font-bold mb-1">Improves Focus</h3>
              <p className="text-sm text-safehaven-neutral-gray">
                Calming activities help clear your mind and improve concentration.
              </p>
            </div>
            <div className="bg-safehaven-soft-purple p-4 rounded-lg">
              <Moon className="h-6 w-6 text-safehaven-primary mb-2" />
              <h3 className="font-bold mb-1">Better Sleep</h3>
              <p className="text-sm text-safehaven-neutral-gray">
                Relaxation techniques before bed can improve sleep quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RelaxationZone