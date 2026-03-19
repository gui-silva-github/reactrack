import { useTranslation } from 'react-i18next'
import useNavigateSPA from '@/hooks/routes/useNavigateSPA'
import Div from '@/components/Html/Div/Div'

const sections = [
  { key: 'talkive', path: '/systems/talkive' },
  { key: 'opinly', path: '/systems/opinly' },
  { key: 'convene', path: '/systems/convene' },
  { key: 'movies', path: '/systems/movies' },
  { key: 'investments', path: '/systems/investments' },
  { key: 'projects', path: '/systems/projects' },
  { key: 'fit', path: '/systems/fit' },
  { key: 'crypto', path: '/systems/crypto' },
]

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigateSPA()

  return (
    <Div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
        {t('dashboard.title')}
      </h1>
      <p className="text-gray-600 text-center mb-8">
        {t('dashboard.subtitle')}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map(({ key, path }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all shadow-sm hover:shadow-md"
          >
            <span className="font-semibold text-lg">{t(`dashboard.${key}`)}</span>
          </button>
        ))}
      </div>
    </Div>
  )
}

export default Dashboard
