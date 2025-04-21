"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocation as useLocationContext } from "@/context/LocationContext"
import { Bell, BookOpen, Info, MapPin, MessageCircle, Phone, ShieldAlert, ShieldCheck } from "lucide-react"
import SOSButton from "@/components/SOS/SOSButton"
import { useSOSAlert } from "@/context/SOSContext"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import GameProgressSummary from "@/components/Dashboard/GameProgressSummary"
import type { EmergencyContact } from "@/types"

const getCookieValue = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

const DashboardPage: React.FC = () => {
  const { startTracking, location } = useLocationContext()
  const { isSOSActive } = useSOSAlert()
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" })
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(() => {
    const userEmail = localStorage.getItem("userEmail")
    const cookieValue = getCookieValue(`emergencyContacts_${userEmail}`)
    return cookieValue ? JSON.parse(cookieValue) : []
  })

  useEffect(() => {
    // Check if user type exists
    const storedUserType = localStorage.getItem("userType")
    if (!storedUserType) {
      navigate("/user-type", { replace: true })
      return
    }

    // Start location tracking on dashboard load
    startTracking()
  }, [navigate, startTracking])

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContact.name || !newContact.relation || !newContact.phone) {
      toast.error("Please fill in all fields")
      return
    }

    const userEmail = localStorage.getItem("userEmail")
    const updatedContacts = [...emergencyContacts, newContact]
    setEmergencyContacts(updatedContacts)
    const cookieName = `emergencyContacts_${userEmail}`
    document.cookie = `${cookieName}=${JSON.stringify(updatedContacts)}; path=/; max-age=31536000`
    setNewContact({ name: "", relation: "", phone: "" })
    setIsDialogOpen(false)
    toast.success("Emergency contact added successfully!")
  }

  return (
    <main className="flex-grow p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-safehaven-primary">
            Welcome, {localStorage.getItem("userName") || "User"}
          </h1>
          <p className="text-safehaven-neutral-gray mt-1">Your digital shield for safety and support</p>
        </div>

        {/* Game Progress Summary */}
        <div className="mb-8">
          <GameProgressSummary />
        </div>

        {/* SOS Button Section */}
        <div className="mb-8 flex flex-col items-center justify-center bg-white p-8 rounded-xl shadow-sm border">
          <div className="mb-4 text-center">
            <h2 className="text-xl font-semibold text-safehaven-primary mb-2">Emergency SOS</h2>
            <p className="text-safehaven-neutral-gray max-w-md mx-auto">
              Press the SOS button in case of emergency. This will immediately alert your emergency contacts and nearby
              authorities.
            </p>
          </div>
          <SOSButton size="lg" className="mt-2" />
          <div className="mt-4 text-sm text-safehaven-neutral-gray">
            {location ? (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-safehaven-primary" />
                Location tracking active
              </div>
            ) : (
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-1 text-amber-500" />
                Enable location for better protection
              </div>
            )}
          </div>
        </div>

        {/* Quick Access Cards */}
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Legal Assistance Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-safehaven-primary" />
                <CardTitle className="text-lg">Legal Assistance</CardTitle>
              </div>
              <CardDescription>Get help with legal issues</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-safehaven-primary text-white"
                onClick={() => navigate("/legal", { replace: true })}
              >
                Chat with Legal Assistant
              </Button>
            </CardContent>
          </Card>

          {/* Counseling Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-safehaven-primary" />
                <CardTitle className="text-lg">Counseling</CardTitle>
              </div>
              <CardDescription>Connect with professional counselors</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-safehaven-primary text-white"
                onClick={() => navigate("/counseling", { replace: true })}
              >
                Book a Session
              </Button>
            </CardContent>
          </Card>

          {/* Activities Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-safehaven-primary" />
                <CardTitle className="text-lg">Activities</CardTitle>
              </div>
              <CardDescription>Learn through interactive games</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full bg-safehaven-primary text-white"
                onClick={() => navigate("/games", { replace: true })}
              >
                Explore Activities
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-safehaven-soft-purple p-2 rounded-full mr-3">
                        <Phone className="h-5 w-5 text-safehaven-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-safehaven-neutral-gray">{contact.relation}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {contact.phone}
                    </Badge>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full text-safehaven-primary border-safehaven-primary border-dashed"
                  onClick={() => setIsDialogOpen(true)}
                >
                  + Add Emergency Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Emergency Contact Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Emergency Contact</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddContact} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Name</Label>
                <Input
                  id="name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Enter contact name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relation">Relationship</Label>
                <Input
                  id="relation"
                  value={newContact.relation}
                  onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                  placeholder="e.g., Parent, Sibling, Friend"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Add Contact
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Safety Tips */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Safety Tips</h2>
            <Button variant="ghost" size="sm" className="text-safehaven-primary">
              View All
            </Button>
          </div>
          <div className="bg-safehaven-soft-purple p-4 rounded-lg">
            <div className="flex items-start space-x-3">
              <ShieldAlert className="h-6 w-6 text-safehaven-primary mt-1" />
              <div>
                <h3 className="font-semibold">Stay Alert in Public Places</h3>
                <p className="text-sm text-safehaven-neutral-gray mt-1">
                  Always be aware of your surroundings when in public places. Avoid using headphones at high volume that
                  might prevent you from hearing important warnings or signals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Notifications</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-safehaven-primary"
              onClick={() => navigate("/notifications", { replace: true })}
            >
              View All
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <div className="p-4 border-b flex items-start space-x-3">
                <div className="bg-safehaven-soft-purple p-2 rounded-full">
                  <Bell className="h-4 w-4 text-safehaven-primary" />
                </div>
                <div>
                  <div className="font-medium">New Safety Resource Available</div>
                  <div className="text-sm text-safehaven-neutral-gray mt-1">
                    Check out the new self-defense techniques in the Activities section.
                  </div>
                  <div className="text-xs text-safehaven-neutral-gray mt-2">2 hours ago</div>
                </div>
              </div>

              <div className="p-4 flex items-start space-x-3">
                <div className="bg-safehaven-soft-purple p-2 rounded-full">
                  <ShieldCheck className="h-4 w-4 text-safehaven-primary" />
                </div>
                <div>
                  <div className="font-medium">Safety Check Reminder</div>
                  <div className="text-sm text-safehaven-neutral-gray mt-1">
                    Don't forget to update your emergency contacts and check in regularly with family.
                  </div>
                  <div className="text-xs text-safehaven-neutral-gray mt-2">Yesterday</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default DashboardPage