import { Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Shell } from './components/Shell'
import { HealthProvider } from './context/HealthContext'
import { AnemiaLens } from './pages/AnemiaLens'
import { Assistant } from './pages/Assistant'
import { Demo } from './pages/Demo'
import { BillGuard } from './pages/BillGuard'
import { Dashboard } from './pages/Dashboard'
import { EndoLens } from './pages/EndoLens'
import { HealthHub } from './pages/HealthHub'
import { Hospitals } from './pages/Hospitals'
import { IronWise } from './pages/IronWise'
import { Library } from './pages/Library'
import { MamaSignal } from './pages/MamaSignal'
import { Medicine } from './pages/Medicine'
import { MenoMap } from './pages/MenoMap'
import { NotFound } from './pages/NotFound'
import { Nutrition } from './pages/Nutrition'
import { OfflineCare } from './pages/OfflineCare'
import { Passport } from './pages/Passport'
import { Privacy } from './pages/Privacy'
import { Reminders } from './pages/Reminders'
import { Reproductive } from './pages/Reproductive'
import { Scanner } from './pages/Scanner'
import { Screening } from './pages/Screening'
import { Settings } from './pages/Settings'
import { SkinTrack } from './pages/SkinTrack'
import { Symptoms } from './pages/Symptoms'
import { Timeline } from './pages/Timeline'
import { Wellness } from './pages/Wellness'

export function App() {
  return (
    <ErrorBoundary>
      <HealthProvider>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/health" element={<HealthHub />} />
            <Route path="/health/anemia-lens" element={<AnemiaLens />} />
            <Route path="/health/reproductive" element={<Reproductive />} />
            <Route path="/symptoms" element={<Symptoms />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/health/mama" element={<MamaSignal />} />
            <Route path="/health/iron" element={<IronWise />} />
            <Route path="/health/endo" element={<EndoLens />} />
            <Route path="/health/meno" element={<MenoMap />} />
            <Route path="/health/timeline" element={<Timeline />} />
            <Route path="/health/skin" element={<SkinTrack />} />
            <Route path="/health/wellness" element={<Wellness />} />
            <Route path="/health/screening" element={<Screening />} />
            <Route path="/health/nutrition" element={<Nutrition />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/medicines" element={<Medicine />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/bills" element={<BillGuard />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/offline" element={<OfflineCare />} />
            <Route path="/passport" element={<Passport />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HealthProvider>
    </ErrorBoundary>
  )
}
