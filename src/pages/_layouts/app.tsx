import Header from "@/components/header"
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router"


export default function AppLayout() {
    const navigate = useNavigate();
    // aqui a gente ta garantindo que o usuario nao va conseguir navegar na aplicacao sem que ele esteja logado
    useEffect(() => {
        const interceptorId = api.interceptors.response.use(
            // sucesso nao faz nada
            response => response,
            // caso der erro
            error => {
                if (isAxiosError(error)) {
                    const status = error.response?.status
                    // code foi adicionado no backend para sempre retornar esse status
                    const code = error.response?.data.code
                    if (status == 401 && code == 'UNAUTHORIZED') {
                        navigate('./sign-in', {
                            // replace faz o usuário nao conseguir voltar no navegador
                            replace: true
                        })
                    }
                }
            }
        )

        return () => {
            // isso aqui é importante para limpar os listeners criados (interceptorid)
            api.interceptors.response.eject(interceptorId)
        }
    }, [navigate])

    return (
        <div className="flex min-h-screen flex-col antialiased">
            <Header/>

            <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
                <Outlet/>
            </div>

        </div>
    )
}