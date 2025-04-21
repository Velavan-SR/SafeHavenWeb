import type React from "react"
import { createContext, useContext, useState } from "react"
import { toast } from "@/components/ui/sonner"
import { useLocation } from "./LocationContext"

// Define the emergency contact type
interface EmergencyContact {
  name: string
  relation: string
  phone: string
}

// Define the user type with emergencyContacts
interface User {
  email?: string
  name?: string
  userType?: "woman" | "child"
  emergencyContacts?: EmergencyContact[]
  location?: { latitude: number; longitude: number }
}

interface SOSContextType {
  isSOSActive: boolean
  triggerSOS: () => void
  cancelSOS: () => void
  markSafe: () => void
}

const SOSContext = createContext<SOSContextType>({
  isSOSActive: false,
  triggerSOS: () => {},
  cancelSOS: () => {},
  markSafe: () => {},
})

export const useSOSAlert = () => useContext(SOSContext)

export const SOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSOSActive, setIsSOSActive] = useState(false)
  const { location, startTracking } = useLocation()

  // Get user data from localStorage
  const getUserData = (): User => {
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")
    const userType = localStorage.getItem("userType") as "woman" | "child" | undefined

    // Get emergency contacts from cookies
    const cookieName = `emergencyContacts_${userEmail}`
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`))
      ?.split("=")[1]

    const emergencyContacts = cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : []

    return {
      email: userEmail || undefined,
      name: userName || undefined,
      userType: userType,
      emergencyContacts: emergencyContacts,
    }
  }

  // Mock function to send alerts to emergency contacts and nearby police
  const sendAlerts = async () => {
    if (!location) {
      toast.error("Location not available. Unable to send accurate alerts.")
      return
    }

    const user = getUserData()

    // In a real application, these would be API calls to your backend
    try {
      // Mock sending alerts to emergency contacts
      console.log("Sending alerts to emergency contacts:", user.emergencyContacts)

      // Mock sending alert to nearby police station
      console.log("Sending alert to police with location:", location)

      // Show feedback to user
      toast.success("SOS alert sent successfully to emergency contacts and police")
    } catch (error) {
      console.error("Error sending alerts:", error)
      toast.error("Failed to send all alerts. Please try again or call emergency services directly.")
    }
  }

  // Trigger SOS alert
  const triggerSOS = () => {
    // Start location tracking if not already active
    startTracking()

    // Set SOS active
    setIsSOSActive(true)

    // Send alerts
    sendAlerts()

    // Alert sound (in a real app)
    // playAlertSound();

    // Notification for user
    toast.error("SOS ALERT ACTIVATED", {
      duration: 10000,
      action: {
        label: "Cancel",
        onClick: cancelSOS,
      },
    })
  }

  // Cancel SOS alert (user only)
  const cancelSOS = () => {
    // In a real app, you might want to require confirmation
    if (window.confirm("Are you sure you want to cancel the SOS alert? Only do this if you are safe.")) {
      setIsSOSActive(false)

      // Mock API call to notify emergency contacts that alert was canceled
      console.log("Notifying emergency contacts that alert was canceled")

      toast.info("SOS alert has been canceled")
    }
  }

  // Mark user as safe (both user and police can confirm)
  const markSafe = () => {
    setIsSOSActive(false)

    // Mock API call to update status in the system
    console.log("Marking user as safe in the system")

    toast.success("You have been marked as safe", {
      description: "The emergency alert has been resolved",
    })
  }

  const value = {
    isSOSActive,
    triggerSOS,
    cancelSOS,
    markSafe,
  }

  return <SOSContext.Provider value={value}>{children}</SOSContext.Provider>
}