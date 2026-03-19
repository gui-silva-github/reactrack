import { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BiCameraMovie, BiSearchAlt2 } from "react-icons/bi"
import { querySearch, redirectUrl } from '@/api/urls/movies'
import Div from '@/components/Html/Div/Div'
import './Navbar.css'

const Navbar: React.FC = () => {
    const { t } = useTranslation()
    const [search, setSearch] = useState("")
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        if (!search) return;

        navigate(`${redirectUrl}${querySearch}${search}`)
        setSearch("")
    }

    return (
        <Div className='margin'>
            <nav id="navbar">
                <h2>
                    <Link to={`${redirectUrl}`}><BiCameraMovie />{t('movies.title')}</Link>
                </h2>
                <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e as unknown as React.FormEvent<HTMLInputElement>)}>
                    <input
                        type="text"
                        placeholder={t('movies.searchPlaceholder')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit">
                        <BiSearchAlt2 />
                    </button>
                </form>
            </nav>
        </Div>
    )
}

export default Navbar