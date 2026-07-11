import { useEffect } from 'react'
import type { ShortcutMatch } from '@/interfaces/keyboard'
import { isEditableTarget } from '@/hooks/keyboard/isEditableTarget'
import { matchKeyboardEvent } from '@/hooks/keyboard/matchKeyboardEvent'

interface UseKeyboardShortcutOptions {
  match: ShortcutMatch
  onTrigger: () => void
  enabled?: boolean
  ignoreEditableTargets?: boolean
}

export function useKeyboardShortcut({
  match,
  onTrigger,
  enabled = true,
  ignoreEditableTargets = true,
}: UseKeyboardShortcutOptions) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (ignoreEditableTargets && isEditableTarget(event.target)) {
        return
      }

      if (!matchKeyboardEvent(event, match)) {
        return
      }

      event.preventDefault()
      onTrigger()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, ignoreEditableTargets, match, onTrigger])
}
