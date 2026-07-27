import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

async function enableMocking() {
  // This app has no real backend by design (see ARCHITECTURE.md §2.1) — MSW
  // stands in for one in every environment, including production, not just
  // local dev.
  const { worker } = await import('./mocks/browser')
  const { seedDatabase } = await import('./mocks/fixtures/seed')
  seedDatabase()
  await worker.start({ onUnhandledRequest: 'bypass' })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
