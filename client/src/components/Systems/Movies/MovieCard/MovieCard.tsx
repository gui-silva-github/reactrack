import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { imgApi, redirectUrl } from "@/api/urls/movies";
import Image from "@/components/Html/Image/Image";
import Header2 from "@/components/Html/Header2/Header2";
import type { IMovieData, ISpecificMovieData } from "@/interfaces/systems/movies";

interface IMovieCardProps {
    key: number;
    movie: IMovieData | ISpecificMovieData;
    showLink?: boolean;
}

const MovieCard: React.FC<IMovieCardProps> = ({ key, movie, showLink=true }) => {
    const { t } = useTranslation()
    return (
        <div className="movie-card" key={key}>
            <Image 
                src={movie.poster_path !== null ? 
                imgApi + movie.poster_path : 
                'https://i.pinimg.com/originals/ff/11/78/ff1178bf89cb845635f083aa57429c6f.jpg'} 
                alt={"title" in movie ? movie.title : movie.belongs_to_collection.name} 
            />
            <Header2 text={"title" in movie ? movie.title : movie.belongs_to_collection.name} />
            <p>
                <FaStar /> {movie.vote_average}
            </p>
            {showLink && <Link to={`${redirectUrl}movie/${movie.id}`}>{t('movies.details')}</Link>}
        </div>
    )
}

export default MovieCard