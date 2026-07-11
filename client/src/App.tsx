import './App.css'
import { ToastContainer } from 'react-toastify'
import { Outlet } from 'react-router-dom'
import GlobalShortcutsListener from '@/components/KeyboardShortcuts/GlobalShortcutsListener/GlobalShortcutsListener'
import ShortcutsModal from '@/components/KeyboardShortcuts/ShortcutsModal/ShortcutsModal'

function App() {

  return (
    <>
      <ToastContainer />
      <GlobalShortcutsListener />
      <ShortcutsModal />
      <Outlet />
    </>
  )
}

export default App
