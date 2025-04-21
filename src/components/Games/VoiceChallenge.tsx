import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Award, Mic, Volume2, ChevronRight, Check } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import GameProgressManager from "./GameProgressManager"

interface VoiceCommand {
  id: string
  command: string
  description: string
  completed?: boolean
}

const VoiceChallenge: React.FC = () => {
  const navigate = useNavigate()
  const [currentCommandIndex, setCurrentCommandIndex] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [challengeComplete, setChallengeComplete] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const timerRef = useRef<number | null>(null)
  const [commands, setCommands] = useState<VoiceCommand[]>([
    {
      id: "v1",
      command: "Help me!",
      description: "A clear, loud call for help that can alert people nearby",
      completed: false,
    },
    {
      id: "v2",
      command: "SafeHaven SOS",
      description: "Activates the SOS feature in the SafeHaven app",
      completed: false,
    },
    {
      id: "v3",
      command: "Call police",
      description: "Instructs the app to contact emergency services",
      completed: false,
    },
    {
      id: "v4",
      command: "Send location",
      description: "Shares your current location with emergency contacts",
      completed: false,
    },
    {
      id: "v5",
      command: "I am in danger",
      description: "Clearly communicates your situation to others",
      completed: false,
    },
  ])
  const [completedCommands, setCompletedCommands] = useState<string[]>([])

  const currentCommand = commands[currentCommandIndex]
  const progress = ((currentCommandIndex + 1) / commands.length) * 100

  // Simulate speech recognition
  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setFeedback(null)

    // Start timer
    timerRef.current = window.setInterval(() => {
      setRecordingTime((prev) => prev + 0.1)
    }, 100)

    // In a real app, this would use the Web Speech API
    // For this demo, we'll simulate recognition after 3 seconds
    setTimeout(() => {
      stopRecording()
    }, 3000)
  }

  const stopRecording = () => {
    setIsRecording(false)

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Simulate voice recognition result
    const randomScore = Math.random()
    let pointsEarned = 0

    if (randomScore > 0.7) {
      setFeedback("Excellent! Your voice was clear and strong.")
      setScore(score + 1)
      pointsEarned = 15

      // Mark command as completed
      const updatedCommands = [...commands]
      updatedCommands[currentCommandIndex] = {
        ...updatedCommands[currentCommandIndex],
        completed: true,
      }
      setCommands(updatedCommands)
      setCompletedCommands([...completedCommands, currentCommand.id])
    } else if (randomScore > 0.4) {
      setFeedback("Good attempt. Try speaking a bit louder and clearer.")
      setScore(score + 0.5)
      pointsEarned = 8
    } else {
      setFeedback("Try again. Speak clearly and directly into the microphone.")
      pointsEarned = 3
    }

    setEarnedPoints(earnedPoints + pointsEarned)
    toast.success(`+${pointsEarned} points earned!`)
  }

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Move to next command
  const handleNext = () => {
    if (currentCommandIndex < commands.length - 1) {
      setCurrentCommandIndex(currentCommandIndex + 1)
      setFeedback(null)
    } else {
      setChallengeComplete(true)

      // Save points to localStorage
      const currentPoints = Number.parseInt(localStorage.getItem("voicePoints") || "0")
      localStorage.setItem("voicePoints", (currentPoints + earnedPoints).toString())

      toast.success(`Voice Challenge Complete!`, {
        description: `You earned ${earnedPoints} points!`,
      })
    }
  }

  const handleReturnHome = () => {
    navigate("/games")
  }

  // Play sample audio
  const playAudio = () => {
    // In a real app, this would play a sample audio of the command
    toast.info("Playing sample audio...")
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <Button variant="ghost" onClick={handleReturnHome} className="mb-4 hover:bg-safehaven-soft-purple">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Activities
      </Button>

      <Card className="w-full">
        {!challengeComplete ? (
          <>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-safehaven-primary">Voice Challenge</CardTitle>
                <div className="text-sm font-medium">
                  Command {currentCommandIndex + 1} of {commands.length}
                </div>
              </div>
              <CardDescription>Practice voice commands for emergency situations</CardDescription>
              <Progress value={progress} className="h-2 mt-2" />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-safehaven-soft-purple p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-2">{currentCommand.command}</h3>
                <p className="text-safehaven-neutral-gray">{currentCommand.description}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={playAudio}>
                  <Volume2 className="h-4 w-4 mr-1" />
                  Hear Sample
                </Button>
              </div>

              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-safehaven-primary rounded-lg">
                {isRecording ? (
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Mic className="h-10 w-10 text-red-500" />
                    </div>
                    <p className="text-lg font-medium mb-2">Recording...</p>
                    <p className="text-sm text-safehaven-neutral-gray">Say: "{currentCommand.command}"</p>
                    <p className="text-xs mt-2">{recordingTime.toFixed(1)}s</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Button
                      className="w-20 h-20 rounded-full bg-safehaven-primary text-white mb-4"
                      onClick={startRecording}
                    >
                      <Mic className="h-10 w-10" />
                    </Button>
                    <p className="text-lg font-medium">Tap to Record</p>
                    <p className="text-sm text-safehaven-neutral-gray">Speak clearly and with confidence</p>
                  </div>
                )}
              </div>

              {feedback && (
                <div className="p-4 bg-safehaven-soft-purple rounded-lg">
                  <p className="font-medium">{feedback}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Commands to Practice:</h3>
                <div className="space-y-2">
                  {commands.map((command, index) => (
                    <div
                      key={command.id}
                      className={`p-3 rounded-lg border ${
                        index === currentCommandIndex
                          ? "border-safehaven-primary bg-safehaven-soft-purple"
                          : command.completed
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{command.command}</span>
                        {command.completed && <Check className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div className="text-sm text-safehaven-neutral-gray">Points: {earnedPoints}</div>
              <Button onClick={handleNext} disabled={!feedback} className="bg-safehaven-primary text-white">
                {currentCommandIndex < commands.length - 1 ? "Next Command" : "Complete Challenge"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="mb-6">
              <Award className="h-16 w-16 text-safehaven-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-safehaven-primary">Voice Challenge Complete!</h2>
              <p className="text-safehaven-neutral-gray mt-2">
                You practiced {commands.length} emergency voice commands
              </p>
              <p className="text-safehaven-primary font-medium mt-2">Points earned: {earnedPoints}</p>
            </div>

            <div className="mb-8">
              {score >= commands.length * 0.8 ? (
                <div className="text-green-600 font-medium">
                  Excellent! Your voice commands were clear and effective.
                </div>
              ) : score >= commands.length * 0.5 ? (
                <div className="text-yellow-600 font-medium">
                  Good job! With more practice, your voice commands will become more effective.
                </div>
              ) : (
                <div className="text-safehaven-neutral-gray font-medium">
                  Keep practicing! Clear voice commands can be crucial in emergency situations.
                </div>
              )}
            </div>

            {/* Add GameProgressManager to update overall progress */}
            <GameProgressManager
              gameId="voice-challenge"
              points={earnedPoints}
              completed={true}
              stars={completedCommands.length >= 4 ? 3 : completedCommands.length >= 2 ? 2 : 1}
              badges={[completedCommands.length >= 4 ? "Voice Master" : "Voice Trainee"]}
            />

            <div className="flex flex-col space-y-2">
              <Button onClick={handleReturnHome} className="bg-safehaven-primary text-white">
                Return to Activities
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentCommandIndex(0)
                  setFeedback(null)
                  setScore(0)
                  setChallengeComplete(false)
                  setEarnedPoints(0)
                  setCommands(commands.map((cmd) => ({ ...cmd, completed: false })))
                  setCompletedCommands([])
                }}
              >
                Retry Challenge
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default VoiceChallenge