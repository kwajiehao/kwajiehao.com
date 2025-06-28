import Router from 'preact-router'
import { LandingPage } from './pages/LandingPage.tsx'

export function App() {
  return (
    <Router>
      <LandingPage path="/" />
    </Router>
  )
}
