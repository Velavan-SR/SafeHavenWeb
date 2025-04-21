import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Award } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GameProgressManager from "./GameProgressManager"

interface ScenarioStep {
  id: string
  description: string
  options: {
    text: string
    nextStep: string
    points: number
    feedback: string
  }[]
}

interface Scenario {
  id: string
  title: string
  description: string
  roles: string[]
  steps: {
    [key: string]: ScenarioStep
  }
  initialStep: string
  endSteps: string[]
}

const emergencyScenario: Scenario = {
  id: "emergency",
  title: "Emergency Response",
  description: "Learn how to respond in an emergency situation from different perspectives",
  roles: ["Person in Danger", "Responder", "Police Officer"],
  initialStep: "start",
  endSteps: ["end_success", "end_partial", "end_fail"],
  steps: {
    start: {
      id: "start",
      description:
        "A woman is walking home alone at night and notices someone following her. She needs to make quick decisions to ensure her safety.",
      options: [
        {
          text: "Call a friend",
          nextStep: "call_friend",
          points: 5,
          feedback: "Good choice, but there are more direct ways to get help in an emergency.",
        },
        {
          text: "Use SafeHaven SOS",
          nextStep: "use_sos",
          points: 10,
          feedback: "Excellent choice! The SOS feature alerts emergency contacts and authorities with your location.",
        },
        {
          text: "Ignore and keep walking",
          nextStep: "ignore",
          points: 0,
          feedback: "This could put you in more danger. Always acknowledge potential threats and take action.",
        },
      ],
    },
    call_friend: {
      id: "call_friend",
      description:
        "You call a friend who answers. They're concerned but are 30 minutes away. The person is still following you.",
      options: [
        {
          text: "Ask friend to stay on the line while you find a public place",
          nextStep: "find_public",
          points: 8,
          feedback: "Good decision. Staying on the phone and moving to a public area increases safety.",
        },
        {
          text: "Now use SafeHaven SOS",
          nextStep: "use_sos",
          points: 10,
          feedback: "Smart move! Using the SOS feature will alert authorities with your location.",
        },
        {
          text: "Tell your friend you'll call back later",
          nextStep: "end_fail",
          points: 0,
          feedback: "This disconnects your safety line. Not recommended in a threatening situation.",
        },
      ],
    },
    use_sos: {
      id: "use_sos",
      description:
        "You activate the SafeHaven SOS. The app immediately sends your location to emergency contacts and nearby police.",
      options: [
        {
          text: "Find a public place while waiting for help",
          nextStep: "find_public",
          points: 10,
          feedback: "Perfect! Moving to a public area while help is on the way maximizes your safety.",
        },
        {
          text: "Confront the follower",
          nextStep: "confront",
          points: 2,
          feedback: "This could escalate the situation. Better to avoid confrontation when possible.",
        },
        {
          text: "Hide in a secluded area",
          nextStep: "hide",
          points: 3,
          feedback: "Hiding in seclusion might make it harder for help to find you.",
        },
      ],
    },
    ignore: {
      id: "ignore",
      description: "You continue walking, trying to ignore the follower. They get closer and start calling out to you.",
      options: [
        {
          text: "Now use SafeHaven SOS",
          nextStep: "use_sos",
          points: 8,
          feedback: "Better late than never! The SOS feature will alert help.",
        },
        {
          text: "Run away",
          nextStep: "run",
          points: 5,
          feedback: "Running can help but without alerting anyone, you're still vulnerable.",
        },
        {
          text: "Confront the follower",
          nextStep: "confront",
          points: 2,
          feedback: "Confrontation without backup is risky.",
        },
      ],
    },
    find_public: {
      id: "find_public",
      description: "You find a convenience store that's open and go inside. The staff notices your distress.",
      options: [
        {
          text: "Tell staff about the situation",
          nextStep: "tell_staff",
          points: 10,
          feedback: "Excellent! Informing others increases your safety network.",
        },
        {
          text: "Wait silently for help to arrive",
          nextStep: "wait_silently",
          points: 7,
          feedback: "You're in a safer place, but communicating would help others assist you better.",
        },
        {
          text: "Leave the store from another exit",
          nextStep: "leave_store",
          points: 4,
          feedback: "Leaving safety before help arrives isn't recommended.",
        },
      ],
    },
    tell_staff: {
      id: "tell_staff",
      description:
        "The staff offers to help and keeps an eye on the entrance. Police arrive within minutes thanks to your SOS alert.",
      options: [
        {
          text: "Provide details to police",
          nextStep: "end_success",
          points: 10,
          feedback: "Perfect! Giving detailed information helps police take appropriate action.",
        },
        {
          text: "Thank everyone and leave quickly",
          nextStep: "end_partial",
          points: 5,
          feedback: "It's better to fully engage with police to ensure the situation is resolved.",
        },
      ],
    },
    end_success: {
      id: "end_success",
      description:
        "The police escort you home safely and take a report about the follower. Your quick thinking and use of SafeHaven kept you safe!",
      options: [],
    },
    end_partial: {
      id: "end_partial",
      description:
        "You're safe for now, but without providing details to authorities, the situation isn't fully resolved.",
      options: [],
    },
    end_fail: {
      id: "end_fail",
      description:
        "Without taking proper safety measures, you remained in a vulnerable position. Remember to use SafeHaven SOS in emergencies!",
      options: [],
    },
  },
}

const RoleplayAdventure: React.FC = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState<string>("Person in Danger")
  const [currentStep, setCurrentStep] = useState<string>(emergencyScenario.initialStep)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [history, setHistory] = useState<
    {
      step: string
      choice?: string
      points?: number
    }[]
  >([{ step: emergencyScenario.initialStep }])

  const scenario = emergencyScenario
  const step = scenario.steps[currentStep]
  const isEndStep = scenario.endSteps.includes(currentStep)

  // Calculate progress
  const progress = Math.min(100, (history.length / 5) * 100)

  // Handle option selection
  const handleSelectOption = (option: any) => {
    // Add points
    setEarnedPoints(earnedPoints + option.points)

    // Show feedback
    toast.info(option.feedback)

    // Update history
    setHistory([...history, { step: option.nextStep, choice: option.text, points: option.points }])

    // Move to next step
    setCurrentStep(option.nextStep)

    // Check if game is complete
    if (scenario.endSteps.includes(option.nextStep)) {
      handleGameComplete()
    }
  }

  // Handle role change
  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    // Reset game for new role
    setCurrentStep(scenario.initialStep)
    setEarnedPoints(0)
    setGameComplete(false)
    setHistory([{ step: scenario.initialStep }])
  }

  // Handle game completion
  const handleGameComplete = () => {
    setGameComplete(true)

    // Save points to localStorage
    const currentPoints = Number.parseInt(localStorage.getItem("roleplayPoints") || "0")
    localStorage.setItem("roleplayPoints", (currentPoints + earnedPoints).toString())

    toast.success(`Roleplay Complete!`, {
      description: `You earned ${earnedPoints} points!`,
    })
  }

  const handleReturnHome = () => {
    navigate("/games")
  }

  const handleRestart = () => {
    setCurrentStep(scenario.initialStep)
    setEarnedPoints(0)
    setGameComplete(false)
    setHistory([{ step: scenario.initialStep }])
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
              <CardTitle className="text-xl text-safehaven-primary">Roleplay Adventure</CardTitle>
              <CardDescription>Experience emergency situations from different perspectives</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">
                Points: <span className="text-safehaven-primary">{earnedPoints}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleRestart}>
                Restart
              </Button>
            </div>
          </div>
          <Progress value={progress} className="h-2 mt-2" />
        </CardHeader>

        <CardContent>
          <Tabs value={selectedRole} onValueChange={handleRoleChange} className="mb-6">
            <TabsList className="grid grid-cols-3">
              {scenario.roles.map((role) => (
                <TabsTrigger key={role} value={role}>
                  {role}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {!isEndStep ? (
            <div className="space-y-6">
              <div className="bg-safehaven-soft-purple p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Scenario: {scenario.title}</h3>
                <p className="text-safehaven-neutral-gray mb-4">{step.description}</p>

                <h4 className="font-medium mb-2">What will you do?</h4>
                <div className="space-y-3">
                  {step.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left p-4 h-auto"
                      onClick={() => handleSelectOption(option)}
                    >
                      {option.text}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Your Journey:</h3>
                <div className="space-y-2">
                  {history
                    .filter((item) => item.choice)
                    .map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border text-sm">
                        <div className="flex justify-between">
                          <span>{item.choice}</span>
                          {item.points !== undefined && (
                            <span className="text-safehaven-primary">+{item.points} pts</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-safehaven-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-safehaven-primary">Scenario Complete!</h2>
              <p className="text-safehaven-neutral-gray mt-2">{step.description}</p>
              <p className="text-safehaven-primary font-medium mt-2">Points earned: {earnedPoints}</p>

              <div className="mt-8 max-w-lg mx-auto">
                <h3 className="font-semibold mb-4">Key Takeaways:</h3>
                <div className="space-y-4 text-left">
                  <div className="bg-safehaven-soft-purple p-4 rounded-lg">
                    <p className="font-bold">Use SafeHaven SOS in emergencies</p>
                    <p className="text-sm mt-1">
                      The SOS feature immediately alerts your emergency contacts and authorities with your location.
                    </p>
                  </div>
                  <div className="bg-safehaven-soft-purple p-4 rounded-lg">
                    <p className="font-bold">Seek public, well-lit areas</p>
                    <p className="text-sm mt-1">
                      Moving to populated areas increases your safety and makes it easier for help to find you.
                    </p>
                  </div>
                  <div className="bg-safehaven-soft-purple p-4 rounded-lg">
                    <p className="font-bold">Communicate clearly with authorities</p>
                    <p className="text-sm mt-1">
                      Providing detailed information helps police and emergency services respond effectively.
                    </p>
                  </div>
                </div>
              </div>
              {isEndStep && (
                <GameProgressManager
                  gameId="roleplay-adventure"
                  points={earnedPoints}
                  completed={true}
                  stars={earnedPoints >= 40 ? 3 : earnedPoints >= 25 ? 2 : 1}
                  badges={[earnedPoints >= 40 ? "Roleplay Master" : "Scenario Solver"]}
                />
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-safehaven-neutral-gray">Role: {selectedRole}</div>
          {isEndStep && (
            <div className="flex space-x-2">
              <Button onClick={handleRestart} variant="outline">
                Try Again
              </Button>
              <Button onClick={handleReturnHome} className="bg-safehaven-primary text-white">
                Return to Activities
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

export default RoleplayAdventure