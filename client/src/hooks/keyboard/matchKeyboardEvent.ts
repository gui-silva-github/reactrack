import type { ShortcutMatch } from '@/interfaces/keyboard'

export function matchKeyboardEvent(event: KeyboardEvent, match: ShortcutMatch): boolean {
  if (event.key.toLowerCase() !== match.key.toLowerCase()) {
    return false
  }

  const wantsCtrl = match.ctrl ?? false
  const wantsShift = match.shift ?? false
  const wantsAlt = match.alt ?? false
  const wantsMeta = match.meta ?? false

  const hasCtrl = event.ctrlKey || event.metaKey

  if (wantsCtrl !== hasCtrl) return false
  if (wantsShift !== event.shiftKey) return false
  if (wantsAlt !== event.altKey) return false
  if (wantsMeta !== event.metaKey) return false

  return true
}
