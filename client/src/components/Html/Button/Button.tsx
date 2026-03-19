import type { IButtonProps } from "@/interfaces/button"

const Button: React.FC<IButtonProps> = ({className, text}) => {
    return (
        <button className={className}>
            {text}
        </button>
    )
}

export default Button   