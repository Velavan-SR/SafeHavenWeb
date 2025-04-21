"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Bell, Book, Home, LogOut, Menu, PhoneCall, ShieldCheck } from "lucide-react"
import SOSButton from "../SOS/SOSButton"

const Navigation: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("isAuthenticated") === "true"
    setIsAuthenticated(authStatus)
  }, [location.pathname])

  // Only hide navigation on auth and user-type pages
  if (location.pathname === "/" || location.pathname === "/user-type") {
    return null
  }

  // Don't show navigation if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      path: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      label: "Legal Assistance",
      path: "/legal",
      active: location.pathname === "/legal",
    },
    {
      icon: <PhoneCall className="h-5 w-5" />,
      label: "Counseling",
      path: "/counseling",
      active: location.pathname === "/counseling",
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: "Activities",
      path: "/games",
      active: location.pathname === "/games" || location.pathname.startsWith("/games/"),
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: "Notifications",
      path: "/notifications",
      active: location.pathname === "/notifications",
    },
  ]

  const handleNavigation = (path: string) => {
    const userType = localStorage.getItem("userType")
    if (!userType) {
      navigate("/user-type", { replace: true })
      return
    }
    navigate(path, { replace: true })
    setIsOpen(false)
  }

  const handleLogout = () => {
    const userEmail = localStorage.getItem("userEmail")
    document.cookie = `emergencyContacts_${userEmail}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`

    localStorage.removeItem("userType")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userData")

    navigate("/", { replace: true })
  }

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigation("/dashboard")}>
              <ShieldCheck className="h-8 w-8 text-safehaven-primary mr-2" />
              <span className="font-bold text-xl text-safehaven-primary">SafeHaven</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                className={`flex items-center ${
                  item.active
                    ? "bg-safehaven-soft-purple text-safehaven-primary"
                    : "text-safehaven-neutral-gray hover:bg-safehaven-soft-purple hover:text-safehaven-primary"
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}

            <SOSButton size="sm" className="ml-2" />

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Button
              variant="ghost"
              className="flex items-center text-safehaven-neutral-gray hover:bg-safehaven-soft-purple"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-4">
            <SOSButton size="sm" />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-6">
                    <ShieldCheck className="h-6 w-6 text-safehaven-primary mr-2" />
                    <span className="font-bold text-lg text-safehaven-primary">SafeHaven</span>
                  </div>

                  <div className="flex flex-col space-y-1 flex-grow">
                    {navItems.map((item) => (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className={`justify-start ${
                          item.active
                            ? "bg-safehaven-soft-purple text-safehaven-primary"
                            : "text-safehaven-neutral-gray hover:bg-safehaven-soft-purple hover:text-safehaven-primary"
                        }`}
                        onClick={() => handleNavigation(item.path)}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      className="justify-start text-safehaven-neutral-gray hover:bg-safehaven-soft-purple"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="ml-2">Logout</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navigation