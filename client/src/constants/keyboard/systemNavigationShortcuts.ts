import { SYSTEM_NAV_LINKS, SYSTEMS_DASHBOARD_PATH } from '@/constants/navigation/systems'
import type { ShortcutDefinition } from '@/interfaces/keyboard'

export const SYSTEM_NAVIGATION_SHORTCUTS: ShortcutDefinition[] = [
  {
    id: 'go-dashboard',
    category: 'systems',
    labelKey: 'shortcuts.goDashboard',
    keys: ['Alt', 'D'],
    match: { key: 'd', alt: true },
    path: SYSTEMS_DASHBOARD_PATH,
  },
  ...SYSTEM_NAV_LINKS.map((link) => ({
    id: `nav-${link.id}`,
    category: 'systems' as const,
    labelKey: `nav.${link.navKey}`,
    keys: ['Alt', link.shortcutDigit],
    match: { key: link.shortcutDigit, alt: true },
    path: link.path,
  })),
]
