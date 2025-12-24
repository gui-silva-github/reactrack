import { conveneImagesEndpoint } from "../../../../../api/urls/convene";
import classes from "./ImagePicker.module.css"

type Image = {
    path: string
    caption: string
}

interface IImagePickerProps {
    images: Image[];
    selectedImage: string; 
    onSelect: (imagePath: string) => void
}

const ImagePicker: React.FC<IImagePickerProps> = ({ images, selectedImage, onSelect}) => {
    return (
        <div id="image-picker">
            <p className={classes.p}>Selecione uma imagem</p>
            <ul className={classes.ul}>
                {images.map((image) => (
                    <li
                        key={image.path}
                        onClick={() => onSelect(image.path)}
                        className={selectedImage === image.path ? `${classes.li} ${classes.selected}` : `${classes.li}`}
                    >
                        <img
                            className={classes.img}
                            src={`${conveneImagesEndpoint}${image.path}`}
                            alt={image.caption}
                        />
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ImagePicker