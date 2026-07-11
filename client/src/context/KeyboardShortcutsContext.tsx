import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { KeyboardShortcutsContextValue } from '@/interfaces/keyboard'

export const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextValue | null>(null)

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = useCallback(() => setIsModalOpen(true), [])
  const closeModal = useCallback(() => setIsModalOpen(false), [])
  const toggleModal = useCallback(() => setIsModalOpen((prev) => !prev), [])

  const value = useMemo(
    () => ({ isModalOpen, openModal, closeModal, toggleModal }),
    [closeModal, isModalOpen, openModal, toggleModal]
  )

  return (
    <KeyboardShortcutsContext.Provider value={value}>
      {children}
    </KeyboardShortcutsContext.Provider>
  )
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext)

  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider')
  }

  return context
}
