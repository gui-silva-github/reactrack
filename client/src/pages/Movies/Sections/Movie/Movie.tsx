import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    BsGraphUp,
    BsWallet2,
    BsHourglassSplit,
    BsFillFileEarmarkTextFill,
    BsCalendar2Check
} from 'react-icons/bs';
import MovieCard from "../../../../components/Systems/Movies/MovieCard/MovieCard";
import Div from "../../../../components/Html/Div/Div";
import Paragraph from "../../../../components/Html/Paragraph/Paragraph";
import { api, apiKey } from "../../../../api/urls/movies";
import type { ISpecificMovieData } from "../../../../interfaces/systems/movies";
import './Movie.css';

const Movie: React.FC = () => {
    const { t } = useTranslation()
    const { id } = useParams();
    const [movie, setMovie] = useState<ISpecificMovieData | null>(null)

    const getMovie = async (url: string) => {
        const res = await fetch(url)
        const data = await res.json()

        setMovie(data)
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        })
    }

    useEffect(() => {
        const movieUrl = `${api}${id}?${apiKey}`
        getMovie(movieUrl)
    }, [])

    return (
        <div className="movie-page">
            {movie && (
                <Div>
                    <MovieCard key={movie.id} movie={movie} showLink={false} />
                    <Div>
                        <Paragraph className='tagline' text={movie.tagline} />

                        <Div className="info">
                            <h3>
                                <BsWallet2 /> {t('movies.budget')}
                            </h3>
                            <Paragraph text={formatCurrency(movie.budget)} />
                        </Div>
                        <Div className="info">
                            <h3>
                                <BsGraphUp /> {t('movies.revenue')}
                            </h3>
                            <Paragraph text={formatCurrency(movie.revenue)} />
                        </Div>
                        <Div className="info">
                            <h3>
                                <BsHourglassSplit /> {t('movies.duration')}
                            </h3>
                            <Paragraph text={`${movie.runtime} ${t('movies.minutes')}`} />
                        </Div>
                        <Div className="info">
                            <h3>
                                <BsCalendar2Check /> {t('movies.releaseDate')}
                            </h3>
                            <Paragraph text={movie.release_date} />
                        </Div>
                        <Div className="info description">
                            <h3>
                                <BsFillFileEarmarkTextFill /> {t('movies.description')}
                            </h3>
                            <Paragraph text={movie.overview} />
                        </Div>
                    </Div>
                </Div>
            )}
        </div>
    )
}

export default Movie