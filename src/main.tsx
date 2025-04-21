import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

// Initialize game progress in localStorage if it doesn't exist
if (!localStorage.getItem("gameProgress")) {
  localStorage.setItem(
    "gameProgress",
    JSON.stringify({
      totalStars: 0,
      totalBadges: [],
      gameProgress: {},
      level: 1,
      experience: 0,
    }),
  )
}

createRoot(document.getElementById("root")!).render(<App />)