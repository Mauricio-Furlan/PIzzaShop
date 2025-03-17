import { Link, LinkProps, useLocation } from "react-router";


export type NavlinkProps = LinkProps
export default function NavLink(props: NavlinkProps) {
    const {pathname} = useLocation()
    // data-current permite condicionar o css usando o tailwind esse eh um exemplo bom para entender como mudar o css atraves de valores de variaveis
    return <Link 
    data-current={pathname === props.to}
    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground data-[current=true]:text-foreground "
    {...props}>
    </Link>
    

}