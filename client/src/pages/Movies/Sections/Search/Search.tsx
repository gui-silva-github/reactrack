import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import MovieCard from "@/components/Systems/Movies/MovieCard/MovieCard"
import type { IMovieData, IMoviesResponse } from "@/interfaces/systems/movies"
import Div from "@/components/Html/Div/Div"
import Paragraph from "@/components/Html/Paragraph/Paragraph"
import "../Home/Home.css"
import { apiKey, searchApi } from "@/api/urls/movies"

const SearchMovie: React.FC = () => {
    const [searchParams] = useSearchParams()
    const { t } = useTranslation()

    const [movies, setMovies] = useState<IMovieData[] | []>([])
    const query = searchParams.get('q')

    const getSearchedMovies = async (url: string) => {
        const res = await fetch(url)
        const data: IMoviesResponse = await res.json()

        setMovies(data.results)
    }

    useEffect(() => {
        const searchWithQueryUrl = `${searchApi}?${apiKey}&query=${query}`
        getSearchedMovies(searchWithQueryUrl)
    }, [query])

    return (
        <Div className="align">
            <Div className="container">
                <h2 className="title">{t('movies.resultsFor')} <span className="query-text">{query}</span></h2>
                <Div className="movies-container">
                    {movies.length === 0 && <Paragraph text={t('movies.loading')} />}
                    {movies.length > 0 && 
                    movies.map((movie: IMovieData) => <MovieCard key={movie.id} movie={movie} />)}
                </Div>
            </Div>
        </Div>
    )
}

export default SearchMovie