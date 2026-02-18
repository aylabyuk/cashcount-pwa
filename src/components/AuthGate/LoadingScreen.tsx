import appIcon from '../../assets/icon.png'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <img src={appIcon} alt="" className="w-16 h-16 mb-4 animate-pulse" />
      <p className="text-sm text-gray-400 dark:text-gray-500">Loading...</p>
    </div>
  )
}
