export type ShortcutCategory = 'general' | 'navigation' | 'systems' | 'appearance'

export interface ShortcutMatch {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
}

export interface ShortcutDefinition {
  id: string
  category: ShortcutCategory
  labelKey: string
  keys: string[]
  match: ShortcutMatch
  path?: string
}

export interface KeyboardShortcutsContextValue {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  toggleModal: () => void
}
