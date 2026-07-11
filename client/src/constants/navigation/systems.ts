export interface SystemNavLink {
  id: string
  path: string
  navKey: string
  dashboardKey: string
  shortcutDigit: string
}

export const SYSTEMS_DASHBOARD_PATH = '/systems'

export const SYSTEM_NAV_LINKS: SystemNavLink[] = [
  { id: 'talkive', path: '/systems/talkive', navKey: 'talkive', dashboardKey: 'talkive', shortcutDigit: '1' },
  { id: 'opinly', path: '/systems/opinly', navKey: 'opinions', dashboardKey: 'opinly', shortcutDigit: '2' },
  { id: 'convene', path: '/systems/convene', navKey: 'events', dashboardKey: 'convene', shortcutDigit: '3' },
  { id: 'movies', path: '/systems/movies', navKey: 'movies', dashboardKey: 'movies', shortcutDigit: '4' },
  { id: 'investments', path: '/systems/investments', navKey: 'investments', dashboardKey: 'investments', shortcutDigit: '5' },
  { id: 'projects', path: '/systems/projects', navKey: 'projects', dashboardKey: 'projects', shortcutDigit: '6' },
  { id: 'fit', path: '/systems/fit', navKey: 'gym', dashboardKey: 'fit', shortcutDigit: '7' },
  { id: 'crypto', path: '/systems/crypto', navKey: 'crypto', dashboardKey: 'crypto', shortcutDigit: '8' },
]
