import { ModusWcThemeProvider } from '@trimble-oss/moduswebcomponents-react'
import { setAssetPath } from '@trimble-oss/moduswebcomponents/components'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppNavbar } from './components/AppNavbar'
import { PmSubcontractDetailPage } from './pages/PmSubcontractDetailPage'
import { PmSubcontractsPage } from './pages/PmSubcontractsPage'

setAssetPath(`${window.location.origin}/`)

function AppShell() {
  return (
    <div className="root-viewport">
      <div className="app-shell">
        <AppNavbar />
        <div className="app-body-row">
          <main id="main-content">
            <Routes>
              <Route path="/" element={<PmSubcontractsPage />} />
              <Route path="/pm-subcontracts" element={<Navigate to="/" replace />} />
              <Route path="/pm-subcontracts/:id" element={<PmSubcontractDetailPage />} />
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
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ModusWcThemeProvider>
  )
}
