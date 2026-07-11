import { SPECIAL_KEY_LABELS } from '@/constants/keyboard/keys'

interface ShortcutKeysProps {
  keys: string[]
}

const ShortcutKeys: React.FC<ShortcutKeysProps> = ({ keys }) => {
  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      {keys.map((key, index) => (
        <span key={`${key}-${index}`} className="inline-flex items-center gap-1">
          {index > 0 ? (
            <span className="text-gray-400 dark:text-gray-500 text-xs" aria-hidden>
              +
            </span>
          ) : null}
          <kbd className="inline-flex min-w-[1.75rem] items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-semibold text-black dark:text-gray-100 shadow-sm">
            {SPECIAL_KEY_LABELS[key] ?? key}
          </kbd>
        </span>
      ))}
    </span>
  )
}

export default ShortcutKeys
