import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { BsSun, BsMoon } from 'react-icons/bs'
import { AppContext } from "@/context/AppContext"

const iconClass = 'w-5 h-5'

const ThemeToggle: React.FC = () => {
  const { t } = useTranslation()
  const context = useContext(AppContext)

  if (!context) return null

  const { theme, setTheme } = context
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      title={isLight ? t('theme.dark') : t('theme.light')}
      aria-label={isLight ? t('theme.dark') : t('theme.light')}
      className="p-2 rounded-lg border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {isLight ? (
        <BsMoon className={iconClass} aria-hidden />
      ) : (
        <BsSun className={iconClass} aria-hidden />
      )}
    </button>
  )
}

export default ThemeToggle
