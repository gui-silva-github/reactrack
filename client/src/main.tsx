import './index.css'

import { createRoot } from 'react-dom/client'
import { AppContextProvider } from './context/AppContext.tsx'
import { RouterProvider } from 'react-router-dom'
import router from './routes/index.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './utils/systems/queryClient/http'

createRoot(document.getElementById('root')!).render(
    <AppContextProvider>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    </AppContextProvider>
)
