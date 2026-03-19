import type { HeadingProps } from "@/interfaces/header"

const Header2: React.FC<HeadingProps> = ({className, text}) => {
    return (
        <h2 className={className}>
            {text}
        </h2>
    )
}

export default Header2