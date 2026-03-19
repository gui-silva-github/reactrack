import type { IDivProps } from "@/interfaces/div"

const Div: React.FC<IDivProps> = ({className, children}) => {
    return (
        <div className={className}>
            {children}
        </div>
    )
} 

export default Div