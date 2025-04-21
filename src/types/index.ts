import type React from "react"

export interface EmergencyContact {
  name: string
  relation: string
  phone: string
}

export interface User {
  email: string
  name?: string
  userType?: "woman" | "child"
  location?: { latitude: number; longitude: number }
  emergencyContacts?: EmergencyContact[]
}

// Game types
export interface GameProgress {
  completed: boolean
  score: number
  stars: number
  badges: string[]
}

export interface UserGameData {
  totalStars: number
  totalBadges: string[]
  gameProgress: {
    [key: string]: GameProgress
  }
  level: number
  experience: number
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
}

export interface GameCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  difficulty: "Easy" | "Medium" | "Hard"
  category: "Safety" | "Knowledge" | "Skills" | "Wellness"
  minAge?: number
  userType: "woman" | "child" | "both"
}

// SOS types
export interface SOSAlert {
  id: string
  userId: string
  timestamp: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  status: "active" | "resolved" | "canceled"
  respondedBy?: string
}

// Counseling types
export interface Counselor {
  id: string
  name: string
  title: string
  image: string
  experience: string
  specialization: string
  languages: string[]
  email: string
  phone: string
  availability: string
  rating: number
}

export interface CounselingSession {
  id: string
  counselorId: string
  userId: string
  date: string
  time: string
  status: "scheduled" | "completed" | "canceled"
  notes?: string
}

// Legal types
export interface LegalTopic {
  id: string
  title: string
  description: string
  keywords: string[]
}

export interface LegalResource {
  id: string
  title: string
  description: string
  url?: string
  phone?: string
}