import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import AppRoutes from './router/index.jsx'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}
