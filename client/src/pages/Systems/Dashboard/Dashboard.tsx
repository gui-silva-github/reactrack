import { useTranslation } from 'react-i18next'
import { SYSTEM_NAV_LINKS } from '@/constants/navigation/systems'
import useNavigateSPA from '@/hooks/routes/useNavigateSPA'
import Div from '@/components/Html/Div/Div'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigateSPA()

  return (
    <Div className="w-full max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
        {t('dashboard.title')}
      </h1>
      <p className="text-gray-600 text-center mb-8">
        {t('dashboard.subtitle')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SYSTEM_NAV_LINKS.map(({ dashboardKey, path, shortcutDigit }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center justify-center min-h-[7.5rem] p-8 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all shadow-sm hover:shadow-md"
          >
            <span className="font-semibold text-xl">{t(`dashboard.${dashboardKey}`)}</span>
            <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {t('shortcuts.pressAlt')} {shortcutDigit}
            </span>
          </button>
        ))}
      </div>
    </Div>
  )
}

export default Dashboard
