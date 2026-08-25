import { ModusWcThemeProvider } from '@trimble-oss/moduswebcomponents-react'
import { setAssetPath } from '@trimble-oss/moduswebcomponents/components'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppNavbar } from './components/AppNavbar'
import { PmSubcontractDetailPage } from './pages/PmSubcontractDetailPage'
import { PmSubcontractsPage } from './pages/PmSubcontractsPage'

const baseUrl = import.meta.env.BASE_URL
const routerBasename = baseUrl.replace(/\/$/, '') || '/'

setAssetPath(`${window.location.origin}${baseUrl}`)

function AppShell() {
  return (
    <div className="root-viewport">
      <div className="app-shell">
        <AppNavbar />
        <div className="app-body-row">
          <main id="main-content">
            <Routes>
              <Route path="/" element={<PmSubcontractsPage />} />
              <Route path="/:id" element={<PmSubcontractDetailPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ModusWcThemeProvider>
      <BrowserRouter basename={routerBasename}>
        <AppShell />
      </BrowserRouter>
    </ModusWcThemeProvider>
  )
}
