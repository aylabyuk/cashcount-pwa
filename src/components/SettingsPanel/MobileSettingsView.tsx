import ThemeSelector from './ThemeSelector'
import InstallAppSection from './InstallAppSection'
import AboutSection from './AboutSection'

export default function MobileSettingsView() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-lg font-semibold">Settings</h2>
      <ThemeSelector />
      <InstallAppSection />
      <AboutSection />
    </div>
  )
}
