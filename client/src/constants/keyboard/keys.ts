export const MODIFIER_LABELS = {
  ctrl: 'Ctrl',
  shift: 'Shift',
  alt: 'Alt',
  meta: 'Cmd',
} as const

export const SPECIAL_KEY_LABELS: Record<string, string> = {
  '?': '?',
  '/': '/',
  Escape: 'Esc',
  Enter: 'Enter',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
}
