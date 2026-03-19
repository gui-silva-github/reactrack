import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Systems/Movies/Navbar/Navbar'

const MoviesProvider = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default MoviesProvider