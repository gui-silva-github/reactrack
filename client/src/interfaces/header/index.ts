export interface HeadingProps {
    className: string;
    text: string;
}

export interface HeadingChildrenProps extends HeadingProps {
    children: React.ReactNode
}