"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, MapPin, Phone, Check, X } from "lucide-react"
import { useSOSAlert } from "@/context/SOSContext"
import { useLocation } from "@/context/LocationContext"
import { useAuth } from "@/context/AuthContext"
import { policeStations } from "@/data/mockData"
import type { EmergencyContact } from "@/types"

const SOSPanel: React.FC = () => {
  const { isSOSActive, cancelSOS, markSafe } = useSOSAlert()
  const { location } = useLocation()
  const { getEmergencyContacts } = useAuth()
  const [elapsedTime, setElapsedTime] = useState(0)
  const [nearbyPolice, setNearbyPolice] = useState(policeStations[0]) // Mock nearest police station
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])

  // Get emergency contacts
  useEffect(() => {
    setEmergencyContacts(getEmergencyContacts())
  }, [getEmergencyContacts])

  // Timer for active SOS
  useEffect(() => {
    let intervalId: number

    if (isSOSActive) {
      setElapsedTime(0)
      intervalId = window.setInterval(() => {
        setElapsedTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isSOSActive])

  // Convert seconds to minutes and seconds
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" + secs : secs}`
  }

  if (!isSOSActive) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-xl overflow-hidden animate-fade-in">
        <CardHeader className="bg-safehaven-alert-red text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldAlert className="h-6 w-6 mr-2 animate-pulse" />
              <CardTitle>EMERGENCY ALERT ACTIVE</CardTitle>
            </div>
            <div className="text-lg font-mono">{formatTime(elapsedTime)}</div>
          </div>
          <CardDescription className="text-white text-opacity-90">Help is on the way. Stay calm.</CardDescription>
        </CardHeader>

        <CardContent className="pt-6 pb-4">
          <Alert className="mb-4 border-safehaven-primary bg-safehaven-soft-purple">
            <MapPin className="h-4 w-4" />
            <AlertTitle>Location Tracking Active</AlertTitle>
            <AlertDescription>
              {location
                ? `Your location is being shared: ${location.address || "Address loading..."}`
                : "Acquiring your location..."}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-safehaven-neutral-gray">Alert Sent To:</h3>
              <ul className="mt-2 space-y-2">
                {emergencyContacts.map((contact, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-safehaven-primary" />
                    <span>
                      {contact.name} ({contact.relation})
                    </span>
                  </li>
                ))}
                <li className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-safehaven-primary" />
                  <span>
                    {nearbyPolice.name}: {nearbyPolice.emergency}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={markSafe}>
            <Check className="h-4 w-4 mr-2" /> I Am Safe Now
          </Button>

          <Button
            variant="outline"
            className="w-full border-safehaven-alert-red text-safehaven-alert-red hover:bg-red-50"
            onClick={cancelSOS}
          >
            <X className="h-4 w-4 mr-2" /> Cancel Alert
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SOSPanel