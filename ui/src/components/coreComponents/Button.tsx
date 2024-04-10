
interface buttonProps extends React.HtmlHTMLAttributes<HTMLSpanElement>{
    children: React.ReactNode
    className?: string
}

export default function Button({className, children, ...rest}:buttonProps){

    return <>            
        <button className={`bg-blue-500 hover:bg-blue-700 text-white front-bold py-2 px-4 border-blue-700 rounded ${className}`} {...rest}>{children}</button>
        </>
}