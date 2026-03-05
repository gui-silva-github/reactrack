import { useState, type KeyboardEvent } from "react"
import { useTranslation } from "react-i18next"
import { BsSearch } from "react-icons/bs"
import Div from "../../../Html/Div/Div"
import Paragraph from "../../../Html/Paragraph/Paragraph"
import Spinner from "../Spinner/Spinner"
import classes from './Search.module.css'

interface ISearchProps {
    loadUser: (userName: string) => Promise<void>
    loading: boolean
}

const Search: React.FC<ISearchProps> = ({ loadUser, loading }) => {
    const { t } = useTranslation()
    const [userName, setUserName] = useState("")

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            loadUser(userName)
        }
    }

    return (
        <Div className={classes.search}>
            <Div className={classes.search_container}>
                <input style={{ color: 'white' }} type="text" placeholder={t('projects.searchPlaceholder')}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button
                    onClick={() => loadUser(userName)}
                    disabled={loading}
                >
                    {loading ? <Spinner /> : <BsSearch />}
                </button>
            </Div>
            <Paragraph className={classes.align} text={t('projects.exploreRepos')} />
        </Div>
    )
}

export default Search