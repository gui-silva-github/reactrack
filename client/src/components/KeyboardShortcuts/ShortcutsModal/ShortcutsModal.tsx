import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  GLOBAL_SHORTCUTS,
  SHORTCUT_CATEGORY_LABEL_KEYS,
  SHORTCUT_CATEGORY_ORDER,
} from '@/constants/keyboard/shortcuts'
import { useKeyboardShortcuts } from '@/context/KeyboardShortcutsContext'
import ShortcutKeys from '@/components/KeyboardShortcuts/ShortcutKeys/ShortcutKeys'

const ShortcutsModal: React.FC = () => {
  const { t } = useTranslation()
  const { isModalOpen, closeModal } = useKeyboardShortcuts()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isModalOpen) {
      if (!dialog.open) {
        dialog.showModal()
      }

      return () => {
        dialog.close()
      }
    }

    if (dialog.open) {
      dialog.close()
    }
  }, [isModalOpen])

  if (!isModalOpen) return null

  return (
    <dialog
      ref={dialogRef}
      onClose={closeModal}
      className="m-auto w-[min(100%,32rem)] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-0 text-black dark:text-gray-100 shadow-2xl backdrop:bg-black/50"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 id="shortcuts-modal-title" className="text-lg font-semibold">
          {t('shortcuts.title')}
        </h2>
        <button
          type="button"
          onClick={closeModal}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-black dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={t('shortcuts.close')}
        >
          {t('shortcuts.close')}
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-6">
        {SHORTCUT_CATEGORY_ORDER.map((category) => {
          const shortcuts = GLOBAL_SHORTCUTS.filter((shortcut) => shortcut.category === category)

          if (shortcuts.length === 0) return null

          return (
            <section key={category}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t(SHORTCUT_CATEGORY_LABEL_KEYS[category])}
              </h3>
              <ul className="space-y-2 list-none m-0 p-0">
                {shortcuts.map((shortcut) => (
                  <li
                    key={shortcut.id}
                    className="flex items-center justify-between gap-4 rounded-lg px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                  >
                    <span className="text-sm">{t(shortcut.labelKey)}</span>
                    <ShortcutKeys keys={shortcut.keys} />
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3 text-xs text-gray-500 dark:text-gray-400">
        {t('shortcuts.hint')}
      </div>
    </dialog>
  )
}

export default ShortcutsModal
