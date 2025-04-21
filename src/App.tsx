import type React from "react"
// src/App.tsx
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { LocationProvider } from "./context/LocationContext"
import { SOSProvider } from "./context/SOSContext"
import { AuthProvider } from "./context/AuthContext"
import { TooltipProvider } from "@/components/ui/tooltip"
import Navigation from "./components/Layout/Navigation"

// Pages
import AuthPage from "./pages/AuthPage"
import UserTypePage from "./pages/UserTypePage"
import DashboardPage from "./pages/DashboardPage"
import LegalAssistancePage from "./pages/LegalAssistancePage"
import CounselingPage from "./pages/CounselingPage"
import GamesPage from "./pages/GamesPage"
import GameDetailPage from "./pages/GameDetailPage"
import NotificationsPage from "./pages/NotificationsPage"

// Game Components
import SafetyQuest from "./components/Games/SafetyQuest"
import BrainBoosterQuiz from "./components/Games/BrainBooster"
import SelfDefenseMoves from "./components/Games/SelfDefenseMoves"
import VoiceChallenge from "./components/Games/VoiceChallenge"
import MemoryGame from "./components/Games/MemoryGame"
import MapHunt from "./components/Games/MapHunt"
import RoleplayAdventure from "./components/Games/RoleplayAdventure"
import RelaxationZone from "./components/Games/RelaxationZone"

const queryClient = new QueryClient()

// Auth guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocationProvider>
            <SOSProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <div className="min-h-screen bg-gray-50">
                  <Navigation />
                  <div className="container mx-auto px-4 py-6">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<AuthPage />} />
                      <Route path="/user-type" element={<UserTypePage />} />

                      {/* Protected routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <DashboardPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/legal"
                        element={
                          <ProtectedRoute>
                            <LegalAssistancePage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/counseling"
                        element={
                          <ProtectedRoute>
                            <CounselingPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games"
                        element={
                          <ProtectedRoute>
                            <GamesPage />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <ProtectedRoute>
                            <NotificationsPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Game routes */}
                      <Route
                        path="/games/:gameId"
                        element={
                          <ProtectedRoute>
                            <GameDetailPage />
                          </ProtectedRoute>
                        }
                      />

                      {/* Direct game routes for deep linking */}
                      <Route
                        path="/games/safety-quest"
                        element={
                          <ProtectedRoute>
                            <SafetyQuest />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games/brain-booster"
                        element={
                          <ProtectedRoute>
                            <BrainBoosterQuiz />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games/self-defense"
                        element={
                          <ProtectedRoute>
                            <SelfDefenseMoves />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games/voice-challenge"
                        element={
                          <ProtectedRoute>
                            <VoiceChallenge />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games/memory-game"
                        element={
                          <ProtectedRoute>
                            <MemoryGame />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games/map-hunt"
                        element={
                          <ProtectedRoute>
                            <MapHunt />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games/roleplay"
                        element={
                          <ProtectedRoute>
                            <RoleplayAdventure />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/games/relaxation"
                        element={
                          <ProtectedRoute>
                            <RelaxationZone />
                          </ProtectedRoute>
                        }
                      />

                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                </div>
              </TooltipProvider>
            </SOSProvider>
          </LocationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App