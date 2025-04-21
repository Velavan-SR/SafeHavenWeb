import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Award, Shield, AlertTriangle } from "lucide-react"
import { toast } from "@/components/ui/sonner"
// Add GameProgressManager to update overall progress
import GameProgressManager from "./GameProgressManager"

interface MapItem {
  id: string
  type: "safe" | "danger" | "tool" | "player"
  x: number
  y: number
  name?: string
  description?: string
  collected?: boolean
}

const MapHunt: React.FC = () => {
  const navigate = useNavigate()
  const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 })
  const [mapItems, setMapItems] = useState<MapItem[]>([])
  const [gameComplete, setGameComplete] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [mapSize] = useState({ width: 8, height: 8 })
  const [collectedTools, setCollectedTools] = useState<string[]>([])
  const [inDanger, setInDanger] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create safe zones
    const safeZones: MapItem[] = [
      { id: "safe1", type: "safe", x: 7, y: 7, name: "Police Station", description: "A safe place with authorities" },
      { id: "safe2", type: "safe", x: 3, y: 6, name: "Hospital", description: "Medical help available here" },
      { id: "safe3", type: "safe", x: 5, y: 2, name: "School", description: "A public place with security" },
    ]

    // Create danger zones
    const dangerZones: MapItem[] = [
      {
        id: "danger1",
        type: "danger",
        x: 2,
        y: 3,
        name: "Dark Alley",
        description: "Poorly lit area with limited visibility",
      },
      {
        id: "danger2",
        type: "danger",
        x: 6,
        y: 4,
        name: "Isolated Area",
        description: "Far from public view and assistance",
      },
      {
        id: "danger3",
        type: "danger",
        x: 4,
        y: 1,
        name: "Suspicious Gathering",
        description: "Group of unknown individuals",
      },
    ]

    // Create tools
    const tools: MapItem[] = [
      {
        id: "tool1",
        type: "tool",
        x: 2,
        y: 5,
        name: "Smart Watch",
        description: "Can send SOS alerts",
        collected: false,
      },
      {
        id: "tool2",
        type: "tool",
        x: 5,
        y: 5,
        name: "Whistle",
        description: "Makes loud noise to attract attention",
        collected: false,
      },
      {
        id: "tool3",
        type: "tool",
        x: 4,
        y: 3,
        name: "Phone",
        description: "Call for help and share location",
        collected: false,
      },
    ]

    // Set player position
    setPlayerPosition({ x: 1, y: 1 })

    // Combine all items
    setMapItems([...safeZones, ...dangerZones, ...tools])
    setGameComplete(false)
    setEarnedPoints(0)
    setMoves(0)
    setGameStarted(false)
    setCollectedTools([])
    setInDanger(false)
  }

  // Move player
  const movePlayer = (dx: number, dy: number) => {
    const newX = Math.max(0, Math.min(mapSize.width - 1, playerPosition.x + dx))
    const newY = Math.max(0, Math.min(mapSize.height - 1, playerPosition.y + dy))

    // Start game on first move
    if (!gameStarted) {
      setGameStarted(true)
    }

    // Update player position
    setPlayerPosition({ x: newX, y: newY })
    setMoves(moves + 1)

    // Check for items at the new position
    checkPosition(newX, newY)
  }

  // Check what's at the current position
  const checkPosition = (x: number, y: number) => {
    // Check for tools
    const tool = mapItems.find((item) => item.type === "tool" && item.x === x && item.y === y && !item.collected)
    if (tool) {
      collectTool(tool)
    }

    // Check for danger zones
    const danger = mapItems.find((item) => item.type === "danger" && item.x === x && item.y === y)
    if (danger) {
      enterDangerZone(danger)
    } else {
      setInDanger(false)
    }

    // Check for safe zones
    const safeZone = mapItems.find((item) => item.type === "safe" && item.x === x && item.y === y)
    if (safeZone) {
      enterSafeZone(safeZone)
    }
  }

  // Collect a tool
  const collectTool = (tool: MapItem) => {
    // Update tool as collected
    const updatedItems = mapItems.map((item) => (item.id === tool.id ? { ...item, collected: true } : item))
    setMapItems(updatedItems)
    setCollectedTools([...collectedTools, tool.id])

    // Add points
    const pointsEarned = 10
    setEarnedPoints(earnedPoints + pointsEarned)

    toast.success(`You found ${tool.name}!`, {
      description: tool.description,
    })
  }

  // Enter a danger zone
  const enterDangerZone = (danger: MapItem) => {
    setInDanger(true)
    toast.error(`Warning: ${danger.name}`, {
      description: danger.description,
    })

    // Lose points if no tools collected
    if (collectedTools.length === 0) {
      const pointsLost = 5
      setEarnedPoints(Math.max(0, earnedPoints - pointsLost))
      toast.error(`-${pointsLost} points! No safety tools to protect you.`)
    }
  }

  // Enter a safe zone
  const enterSafeZone = (safeZone: MapItem) => {
    toast.success(`You reached ${safeZone.name}!`, {
      description: safeZone.description,
    })

    // Add bonus points
    const basePoints = 15
    const toolBonus = collectedTools.length * 5
    const totalPoints = basePoints + toolBonus
    setEarnedPoints(earnedPoints + totalPoints)

    toast.success(`+${totalPoints} points!`, {
      description: `Base: ${basePoints}, Tool Bonus: ${toolBonus}`,
    })

    // Check if all tools collected and reached final safe zone
    if (collectedTools.length === 3 && safeZone.id === "safe1") {
      handleGameComplete()
    }
  }

  // Handle game completion
  const handleGameComplete = () => {
    setGameComplete(true)

    // Calculate final score
    const movesBonus = Math.max(0, 50 - Math.floor(moves / 5) * 5)
    const finalPoints = earnedPoints + movesBonus

    setEarnedPoints(finalPoints)

    // Save points to localStorage
    const currentPoints = Number.parseInt(localStorage.getItem("mapPoints") || "0")
    localStorage.setItem("mapPoints", (currentPoints + finalPoints).toString())

    toast.success(`Map Hunt Complete! +${movesBonus} bonus points!`, {
      description: `Total points earned: ${finalPoints}`,
    })
  }

  const handleReturnHome = () => {
    navigate("/games")
  }

  const renderMap = () => {
    const grid = []

    for (let y = 0; y < mapSize.height; y++) {
      const row = []
      for (let x = 0; x < mapSize.width; x++) {
        // Check what's at this position
        const isPlayer = playerPosition.x === x && playerPosition.y === y
        const item = mapItems.find((item) => item.x === x && item.y === y)

        let cellClass = "bg-gray-100 border border-gray-200"
        let content = null

        if (isPlayer) {
          cellClass = inDanger ? "bg-red-100 border border-red-300" : "bg-blue-100 border border-blue-300"
          content = <div className="h-full w-full flex items-center justify-center">👤</div>
        } else if (item) {
          if (item.type === "safe") {
            cellClass = "bg-green-100 border border-green-300"
            content = <Shield className="h-4 w-4 text-green-600" />
          } else if (item.type === "danger") {
            cellClass = "bg-red-100 border border-red-300"
            content = <AlertTriangle className="h-4 w-4 text-red-600" />
          } else if (item.type === "tool" && !item.collected) {
            cellClass = "bg-yellow-100 border border-yellow-300"
            content = <div className="h-full w-full flex items-center justify-center">🔧</div>
          }
        }

        row.push(
          <div
            key={`${x}-${y}`}
            className={`aspect-square ${cellClass} flex items-center justify-center`}
            title={item?.name}
          >
            {content}
          </div>,
        )
      }
      grid.push(
        <div key={y} className="flex">
          {row}
        </div>,
      )
    }

    return <div className="grid grid-cols-1">{grid}</div>
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
              <CardTitle className="text-xl text-safehaven-primary">Map Hunt: Escape to Safety</CardTitle>
              <CardDescription>Navigate through the map to find safe zones and collect tools</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">
                Moves: <span className="text-safehaven-primary">{moves}</span>
              </div>
              <div className="text-sm font-medium">
                Tools: <span className="text-safehaven-primary">{collectedTools.length}</span>/3
              </div>
              <Button variant="outline" size="sm" onClick={initializeGame}>
                Restart
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!gameComplete ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">{renderMap()}</div>
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <Button onClick={() => movePlayer(0, -1)}>
                    <ArrowLeft className="h-4 w-4 rotate-90" />
                  </Button>
                  <div></div>
                  <Button onClick={() => movePlayer(-1, 0)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div></div>
                  <Button onClick={() => movePlayer(1, 0)}>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </Button>
                  <div></div>
                  <Button onClick={() => movePlayer(0, 1)}>
                    <ArrowLeft className="h-4 w-4 -rotate-90" />
                  </Button>
                  <div></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-safehaven-soft-purple p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Mission</h3>
                  <p>
                    Navigate to the Police Station (top right) while collecting all safety tools. Avoid danger zones or
                    have tools to protect yourself.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Legend</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-100 border border-blue-300 mr-2"></div>
                      <span>You</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 mr-2"></div>
                      <span>Safe Zone</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-100 border border-red-300 mr-2"></div>
                      <span>Danger Zone</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 mr-2"></div>
                      <span>Tool</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">Collected Tools</h3>
                  <div className="space-y-2">
                    {collectedTools.length === 0 ? (
                      <p className="text-safehaven-neutral-gray">No tools collected yet</p>
                    ) : (
                      mapItems
                        .filter((item) => item.type === "tool" && item.collected)
                        .map((tool) => (
                          <div key={tool.id} className="bg-yellow-50 p-2 rounded border border-yellow-200">
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-xs text-safehaven-neutral-gray">{tool.description}</p>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-safehaven-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-safehaven-primary">Mission Accomplished!</h2>
              <p className="text-safehaven-neutral-gray mt-2">
                You successfully navigated to safety in {moves} moves and collected all tools!
              </p>
              <p className="text-safehaven-primary font-medium mt-2">Points earned: {earnedPoints}</p>

              <div className="mt-8 max-w-lg mx-auto">
                <h3 className="font-semibold mb-4">Safety Tips:</h3>
                <div className="space-y-4 text-left">
                  <div className="bg-safehaven-soft-purple p-4 rounded-lg">
                    <p className="font-bold">Always be aware of your surroundings</p>
                    <p className="text-sm mt-1">
                      Pay attention to who and what is around you, especially in unfamiliar areas.
                    </p>
                  </div>
                  <div className="bg-safehaven-soft-purple p-4 rounded-lg">
                    <p className="font-bold">Identify safe zones in advance</p>
                    <p className="text-sm mt-1">
                      Know where police stations, hospitals, and other public safe spaces are located.
                    </p>
                  </div>
                  <div className="bg-safehaven-soft-purple p-4 rounded-lg">
                    <p className="font-bold">Carry safety tools</p>
                    <p className="text-sm mt-1">
                      A phone, whistle, or personal alarm can help you call for help in emergencies.
                    </p>
                  </div>
                </div>
              </div>
              <GameProgressManager
                gameId="map-hunt"
                points={earnedPoints}
                completed={true}
                stars={collectedTools.length === 3 ? 3 : collectedTools.length >= 2 ? 2 : 1}
                badges={[collectedTools.length === 3 ? "Navigation Expert" : "Safety Navigator"]}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-safehaven-neutral-gray">Points: {earnedPoints}</div>
          {gameComplete && (
            <div className="flex space-x-2">
              <Button onClick={initializeGame} variant="outline">
                Play Again
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

export default MapHunt