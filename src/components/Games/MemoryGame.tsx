import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Award, BookOpen, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/sonner"
import { quizQuestions } from "@/data/mockData"
// Add GameProgressManager to update overall progress
import GameProgressManager from "./GameProgressManager"

const lawsAndRights = quizQuestions.lawsAndRights

interface MemoryCard {
  id: string
  content: string
  type: "law" | "description"
  matched: boolean
  flipped: boolean
  matchId: string
}

const MemoryGame: React.FC = () => {
  const navigate = useNavigate()
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<MemoryCard[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    // Create pairs of cards (laws and their descriptions)
    const cardPairs: MemoryCard[] = []

    lawsAndRights.forEach((item) => {
      // Law card
      cardPairs.push({
        id: `law-${item.id}`,
        content: item.law,
        type: "law",
        matched: false,
        flipped: false,
        matchId: item.id,
      })

      // Description card
      cardPairs.push({
        id: `desc-${item.id}`,
        content: item.description,
        type: "description",
        matched: false,
        flipped: false,
        matchId: item.id,
      })
    })

    // Shuffle cards
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setGameComplete(false)
    setEarnedPoints(0)
    setGameStarted(false)
  }

  // Handle card click
  const handleCardClick = (clickedCard: MemoryCard) => {
    // Don't allow clicking if card is already matched or flipped
    if (clickedCard.matched || clickedCard.flipped || flippedCards.length >= 2) {
      return
    }

    // Start game on first card click
    if (!gameStarted) {
      setGameStarted(true)
    }

    // Flip the card
    const updatedCards = cards.map((card) => (card.id === clickedCard.id ? { ...card, flipped: true } : card))
    setCards(updatedCards)

    // Add to flipped cards
    const updatedFlippedCards = [...flippedCards, clickedCard]
    setFlippedCards(updatedFlippedCards)

    // If two cards are flipped, check for a match
    if (updatedFlippedCards.length === 2) {
      setMoves(moves + 1)

      const [firstCard, secondCard] = updatedFlippedCards

      // Check if cards match (same matchId but different types)
      if (firstCard.matchId === secondCard.matchId && firstCard.type !== secondCard.type) {
        // It's a match!
        setTimeout(() => {
          const matchedCards = cards.map((card) =>
            card.matchId === firstCard.matchId ? { ...card, matched: true, flipped: false } : card,
          )
          setCards(matchedCards)
          setFlippedCards([])
          setMatchedPairs(matchedPairs + 1)

          // Add points for match
          const pointsEarned = 15
          setEarnedPoints(earnedPoints + pointsEarned)
          toast.success(`Match found! +${pointsEarned} points`)

          // Check if game is complete
          if (matchedPairs + 1 === lawsAndRights.length) {
            handleGameComplete()
          }
        }, 1000)
      } else {
        // Not a match, flip cards back
        setTimeout(() => {
          const resetCards = cards.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id ? { ...card, flipped: false } : card,
          )
          setCards(resetCards)
          setFlippedCards([])
        }, 1500)
      }
    }
  }

  // Handle game completion
  const handleGameComplete = () => {
    setGameComplete(true)

    // Calculate bonus points based on moves
    const totalPairs = lawsAndRights.length
    const perfectMoves = totalPairs * 2 // Theoretical minimum moves
    const bonusPoints = Math.max(0, 50 - Math.floor((moves - perfectMoves) / 2) * 5)
    const finalPoints = earnedPoints + bonusPoints

    setEarnedPoints(finalPoints)

    // Save points to localStorage
    const currentPoints = Number.parseInt(localStorage.getItem("memoryPoints") || "0")
    localStorage.setItem("memoryPoints", (currentPoints + finalPoints).toString())

    toast.success(`Game Complete! +${bonusPoints} bonus points!`, {
      description: `Total points earned: ${finalPoints}`,
    })
  }

  const handleReturnHome = () => {
    navigate("/games")
  }

  const handleRestart = () => {
    initializeGame()
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
              <CardTitle className="text-xl text-safehaven-primary">Know Your Rights</CardTitle>
              <CardDescription>Match laws with their descriptions to learn about your rights</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-medium">
                Moves: <span className="text-safehaven-primary">{moves}</span>
              </div>
              <div className="text-sm font-medium">
                Matches: <span className="text-safehaven-primary">{matchedPairs}</span>/{lawsAndRights.length}
              </div>
              <Button variant="outline" size="sm" onClick={handleRestart}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Restart
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!gameComplete ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`aspect-[3/4] cursor-pointer transition-all duration-300 ${
                    card.flipped || card.matched
                      ? "rotate-y-180"
                      : "bg-safehaven-primary text-white hover:bg-safehaven-primary/90"
                  }`}
                  onClick={() => handleCardClick(card)}
                >
                  <div
                    className={`h-full w-full rounded-lg border-2 flex items-center justify-center p-4 text-center ${
                      card.flipped || card.matched
                        ? card.type === "law"
                          ? "bg-safehaven-soft-purple border-safehaven-primary"
                          : "bg-safehaven-soft-blue border-safehaven-secondary"
                        : "bg-safehaven-primary border-white"
                    }`}
                  >
                    {card.flipped || card.matched ? (
                      <div className="flex flex-col items-center">
                        {card.type === "law" && <BookOpen className="h-5 w-5 mb-2 text-safehaven-primary" />}
                        <span className="text-sm font-medium">{card.content}</span>
                      </div>
                    ) : (
                      <BookOpen className="h-8 w-8" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-16 w-16 text-safehaven-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-safehaven-primary">Congratulations!</h2>
              <p className="text-safehaven-neutral-gray mt-2">
                You completed the game in {moves} moves and earned {earnedPoints} points!
              </p>

              <div className="mt-8 max-w-lg mx-auto">
                <h3 className="font-semibold mb-4">Laws & Rights You've Learned:</h3>
                <div className="space-y-4">
                  {lawsAndRights.map((item) => (
                    <div key={item.id} className="bg-safehaven-soft-purple p-4 rounded-lg text-left">
                      <p className="font-bold">{item.law}</p>
                      <p className="text-sm mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              {gameComplete && (
                <GameProgressManager
                  gameId="memory-game"
                  points={earnedPoints}
                  completed={true}
                  stars={matchedPairs === lawsAndRights.length ? 3 : matchedPairs >= lawsAndRights.length * 0.7 ? 2 : 1}
                  badges={[matchedPairs === lawsAndRights.length ? "Memory Master" : "Rights Learner"]}
                />
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-safehaven-neutral-gray">Points: {earnedPoints}</div>
          {gameComplete && (
            <div className="flex space-x-2">
              <Button onClick={handleRestart} variant="outline">
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

export default MemoryGame