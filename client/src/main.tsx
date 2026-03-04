import './index.css'
import './i18n'

import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { AppContextProvider } from './context/AppContext.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './utils/systems/queryClient/http'

createRoot(document.getElementById('root')!).render(
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">...</div>}>
        <AppContextProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </AppContextProvider>
    </Suspense>
)
