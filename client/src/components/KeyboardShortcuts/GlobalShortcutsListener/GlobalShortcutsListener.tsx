import { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GLOBAL_SHORTCUTS } from '@/constants/keyboard/shortcuts'
import { AppContext } from '@/context/AppContext'
import { useKeyboardShortcuts } from '@/context/KeyboardShortcutsContext'
import { useKeyboardShortcut } from '@/hooks/keyboard/useKeyboardShortcut'
import useNavigateSPA from '@/hooks/routes/useNavigateSPA'

const GlobalShortcutsListener: React.FC = () => {
  const { i18n } = useTranslation()
  const navigate = useNavigateSPA()
  const { isModalOpen, openModal, closeModal } = useKeyboardShortcuts()
  const context = useContext(AppContext)

  const shortcutsById = useMemo(
    () => Object.fromEntries(GLOBAL_SHORTCUTS.map((shortcut) => [shortcut.id, shortcut])),
    []
  )

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(i18n.language === 'en' ? 'pt' : 'en')
  }, [i18n])

  const toggleTheme = useCallback(() => {
    if (!context) return
    context.setTheme(context.theme === 'light' ? 'dark' : 'light')
  }, [context])

  const handleShortcut = useCallback(
    (id: string) => {
      const shortcut = shortcutsById[id]

      if (shortcut?.path) {
        navigate(shortcut.path)
        return
      }

      switch (id) {
        case 'show-shortcuts':
          openModal()
          break
        case 'close-modal':
          if (isModalOpen) closeModal()
          break
        case 'toggle-language':
          toggleLanguage()
          break
        case 'toggle-theme':
          toggleTheme()
          break
        default:
          break
      }
    },
    [closeModal, isModalOpen, navigate, openModal, shortcutsById, toggleLanguage, toggleTheme]
  )

  return (
    <>
      {GLOBAL_SHORTCUTS.map((shortcut) => (
        <ShortcutBinder
          key={shortcut.id}
          match={shortcut.match}
          enabled={shortcut.id !== 'close-modal' || isModalOpen}
          onTrigger={() => handleShortcut(shortcut.id)}
        />
      ))}
    </>
  )
}

interface ShortcutBinderProps {
  match: (typeof GLOBAL_SHORTCUTS)[number]['match']
  onTrigger: () => void
  enabled?: boolean
}

const ShortcutBinder: React.FC<ShortcutBinderProps> = ({ match, onTrigger, enabled = true }) => {
  useKeyboardShortcut({ match, onTrigger, enabled })
  return null
}

export default GlobalShortcutsListener
