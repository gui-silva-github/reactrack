import Div from "@/components/Html/Div/Div"
import classes from "./ErrorBlock.module.css"

const ErrorBlock: React.FC<{title: string, message: string, errors?: any[]}> = ({title, message, errors}) => {
    return (
        <Div className={classes.errorBlock}>
            <Div className={classes.icon}>!</Div>
            <Div className="error-block-text">
                <h2 className={classes.h2}>{title}</h2>
                <p className={classes.p}>{message}</p>
                {errors && Object.values(errors).length > 0 && (
                    <ul>
                        {Object.values(errors).map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
            </Div>
        </Div>
    )
}

export default ErrorBlock