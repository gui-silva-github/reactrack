import type { HeadingProps } from "@/interfaces/header"

const Header1: React.FC<HeadingProps> = ({className, text}) => {
    return (
        <h1 className={className}>
            {text}
        </h1>
    )
}

export default Header1