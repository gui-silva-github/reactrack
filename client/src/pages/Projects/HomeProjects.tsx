import Search from "@/components/Systems/Projects/Search/Search"
import User from "@/components/Systems/Projects/User/User"
import Error from "@/components/Systems/Projects/Error/Error"
import Div from "@/components/Html/Div/Div"
import { useState } from 'react'
import type { IUserProps } from "@/api/projects"
import { projectsGitHubEndpoint } from "@/api/urls/projects"

const HomeProjects: React.FC = () => {

    const [user, setUser] = useState<IUserProps | null>(null)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const loadUser = async (userName: string) => {
        setError(false)
        setUser(null)
        setLoading(true)

        try {
            const res = await fetch(`${projectsGitHubEndpoint}/${userName}`)
            const data = await res.json()

            if (res.status === 404) {
                setError(true)
                return
            }

            const { avatar_url, login, location, followers, following } = data

            setUser({
                avatar_url,
                login,
                location,
                followers,
                following
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Div>
            <Search loadUser={loadUser} loading={loading} />
            {user && <User {...user} />}
            {error && <Error />}
        </Div>
    )
}

export default HomeProjects