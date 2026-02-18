export default function AboutSection() {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">About</h3>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p>This is an independent app and is not produced, maintained, or sponsored by The Church of Jesus Christ of Latter-day Saints.</p>
        <p>Bugs/features: <a href="mailto:oriel.absin@gmail.com?subject=CashCount%20PWA%20Feedback&body=Hi%2C%0A%0A%5BDescribe%20your%20bug%20or%20feature%20request%20here%5D%0A%0ADevice%3A%20%0ABrowser%3A%20" className="underline hover:text-gray-600 dark:hover:text-gray-300">oriel.absin@gmail.com</a></p>
      </div>
    </div>
  )
}
