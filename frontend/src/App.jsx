import { Navbar } from "./components/Navbar"
import { AppRoutes } from "./routes/AppRoutes"

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <AppRoutes />
      </main>
    </div>
  )
}

export default App
