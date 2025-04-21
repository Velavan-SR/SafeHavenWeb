"use client"

import type React from "react"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import BrainBoosterQuiz from "@/components/Games/BrainBooster"
import SafetyQuest from "@/components/Games/SafetyQuest"
import SelfDefenseMoves from "@/components/Games/SelfDefenseMoves"
import VoiceChallenge from "@/components/Games/VoiceChallenge"
import MemoryGame from "@/components/Games/MemoryGame"
import MapHunt from "@/components/Games/MapHunt"
import RoleplayAdventure from "@/components/Games/RoleplayAdventure"
import RelaxationZone from "@/components/Games/RelaxationZone"
import SOSPanel from "@/components/SOS/SOSPanel"
import { useSOSAlert } from "@/context/SOSContext"

const GameDetailPage: React.FC = () => {
  const { isSOSActive } = useSOSAlert()
  const navigate = useNavigate()
  const { gameId } = useParams<{ gameId: string }>()

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (!userType) {
      navigate("/user-type", { replace: true })
    }
  }, [navigate])

  // Render appropriate game component based on gameId
  const renderGame = () => {
    switch (gameId) {
      case "brain-booster":
        return <BrainBoosterQuiz />
      case "safety-quest":
        return <SafetyQuest />
      case "self-defense":
        return <SelfDefenseMoves />
      case "voice-challenge":
        return <VoiceChallenge />
      case "memory-game":
        return <MemoryGame />
      case "map-hunt":
        return <MapHunt />
      case "roleplay":
        return <RoleplayAdventure />
      case "relaxation":
        return <RelaxationZone />
      default:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-safehaven-primary mb-4">Under Development</h2>
            <p className="text-safehaven-neutral-gray">
              This activity is currently being developed. Please check back soon!
            </p>
            <button
              onClick={() => navigate("/games")}
              className="mt-6 px-4 py-2 bg-safehaven-primary text-white rounded-md"
            >
              Return to Activities
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {isSOSActive && <SOSPanel />}

      <main className="flex-grow">{renderGame()}</main>
    </div>
  )
}

export default GameDetailPage