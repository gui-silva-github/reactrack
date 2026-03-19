import type { IImageProps } from "@/interfaces/image"

const Image: React.FC<IImageProps> = ({src, className, alt}) => {
    return (
        <img src={src} className={className} alt={alt} />
    )
}

export default Image