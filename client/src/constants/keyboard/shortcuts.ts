import { SYSTEM_NAVIGATION_SHORTCUTS } from '@/constants/keyboard/systemNavigationShortcuts'
import type { ShortcutCategory, ShortcutDefinition } from '@/interfaces/keyboard'

export const SHORTCUT_CATEGORY_LABEL_KEYS: Record<ShortcutCategory, string> = {
  general: 'shortcuts.categories.general',
  navigation: 'shortcuts.categories.navigation',
  systems: 'shortcuts.categories.systems',
  appearance: 'shortcuts.categories.appearance',
}

const CORE_SHORTCUTS: ShortcutDefinition[] = [
  {
    id: 'show-shortcuts',
    category: 'general',
    labelKey: 'shortcuts.showShortcuts',
    keys: ['Shift', '?'],
    match: { key: '?', shift: true },
  },
  {
    id: 'close-modal',
    category: 'general',
    labelKey: 'shortcuts.closeModal',
    keys: ['Esc'],
    match: { key: 'Escape' },
  },
  {
    id: 'go-home',
    category: 'navigation',
    labelKey: 'shortcuts.goHome',
    keys: ['Alt', 'H'],
    match: { key: 'h', alt: true },
    path: '/',
  },
  {
    id: 'go-login',
    category: 'navigation',
    labelKey: 'shortcuts.goLogin',
    keys: ['Alt', 'Shift', 'L'],
    match: { key: 'l', alt: true, shift: true },
    path: '/login',
  },
  {
    id: 'toggle-language',
    category: 'appearance',
    labelKey: 'shortcuts.toggleLanguage',
    keys: ['Alt', 'L'],
    match: { key: 'l', alt: true },
  },
  {
    id: 'toggle-theme',
    category: 'appearance',
    labelKey: 'shortcuts.toggleTheme',
    keys: ['Alt', 'T'],
    match: { key: 't', alt: true },
  },
]

export const GLOBAL_SHORTCUTS: ShortcutDefinition[] = [
  ...CORE_SHORTCUTS,
  ...SYSTEM_NAVIGATION_SHORTCUTS,
]

export const SHORTCUT_CATEGORY_ORDER: ShortcutCategory[] = [
  'general',
  'navigation',
  'systems',
  'appearance',
]
