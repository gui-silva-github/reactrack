import type { IParagraphProps } from "@/interfaces/paragraph"

const Paragraph: React.FC<IParagraphProps> = ({className, text}) => {
    return (
        <p className={className}>
            {text}
        </p>
    )
}

export default Paragraph