import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"

// Define the emergency contact type
interface EmergencyContact {
  name: string
  relation: string
  phone: string
}

interface User {
  email: string
  name?: string
  userType?: "woman" | "child"
  location?: { latitude: number; longitude: number }
  emergencyContacts?: EmergencyContact[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => void
  signup: (email: string, password: string, name: string) => void
  logout: () => void
  setUserType: (type: "woman" | "child") => void
  updateUserLocation: (location: { latitude: number; longitude: number }) => void
  getEmergencyContacts: () => EmergencyContact[]
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  setUserType: () => {},
  updateUserLocation: () => {},
  getEmergencyContacts: () => [],
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData")
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"

    if (storedUserData && isAuthenticated) {
      const userData = JSON.parse(storedUserData)
      const userType = localStorage.getItem("userType") as "woman" | "child" | undefined

      setUser({
        ...userData,
        userType,
        emergencyContacts: getEmergencyContacts(),
      })
    }
  }, [])

  const getEmergencyContacts = (): EmergencyContact[] => {
    const userEmail = localStorage.getItem("userEmail") || user?.email
    if (!userEmail) return []

    const cookieName = `emergencyContacts_${userEmail}`
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${cookieName}=`))
      ?.split("=")[1]

    return cookieValue ? JSON.parse(decodeURIComponent(cookieValue)) : []
  }

  const signup = (email: string, password: string, name: string) => {
    const newUser = { email, name }
    setUser(newUser)

    // Store in localStorage
    localStorage.setItem("userData", JSON.stringify(newUser))
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)
    localStorage.setItem("userName", name)

    toast.success("Account created successfully!")
  }

  const login = (email: string, password: string) => {
    const userData = {
      email,
      isAuthenticated: true,
    }

    // Store in localStorage
    localStorage.setItem("userData", JSON.stringify(userData))
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userEmail", email)

    setUser({ email })
    toast.success("Logged in successfully!")
  }

  const logout = () => {
    setUser(null)

    // Clear localStorage
    localStorage.removeItem("userData")
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userType")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")

    toast.success("Logged out successfully")
  }

  const setUserType = (type: "woman" | "child") => {
    if (user) {
      const updatedUser = { ...user, userType: type }
      setUser(updatedUser)
      localStorage.setItem("userType", type)
      toast.success("Profile updated successfully!")
    }
  }

  const updateUserLocation = (location: { latitude: number; longitude: number }) => {
    if (user) {
      const updatedUser = { ...user, location }
      setUser(updatedUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        setUserType,
        updateUserLocation,
        getEmergencyContacts,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}