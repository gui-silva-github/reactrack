import type { HeadingChildrenProps } from "@/interfaces/header"

const HeaderImg: React.FC<HeadingChildrenProps> = ({className, text, children}) => {
    return (
        <h1 className={className}>
            {text}
            {children}
        </h1>
    )
}

export default HeaderImg