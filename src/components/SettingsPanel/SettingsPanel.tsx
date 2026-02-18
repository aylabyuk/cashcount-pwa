import { useState, useEffect, useRef } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { SPRING_MODAL } from '../../utils/constants'
import ThemeSelector from './ThemeSelector'
import InstallAppSection from './InstallAppSection'
import AboutSection from './AboutSection'

export default function SettingsPanel() {
  const [collapsed, setCollapsed] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState<number | 'auto'>('auto')

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  })

  const springStyles = useSpring({
    height: collapsed ? 0 : contentHeight,
    opacity: collapsed ? 0 : 1,
    config: SPRING_MODAL,
  })

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 shrink-0">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-black/2 dark:hover:bg-white/2"
      >
        <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Settings</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <animated.div style={{ ...springStyles, overflow: 'hidden' }}>
        <div ref={contentRef} className="px-4 pb-4 space-y-4">
          <ThemeSelector />
          <InstallAppSection />
          <AboutSection />
        </div>
      </animated.div>
    </div>
  )
}
