import { Building, ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator  } from "./ui/dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import getProfile from "@/api/get-profile";
import getManagedRestaurant from "@/api/get-manager-restaurant";
import { Skeleton } from "./ui/skeleton";
import { DialogTrigger, Dialog } from "./ui/dialog";
import StoreProfileDialog from "./store-profile-dialog";
import signOut from "@/api/sign-out";
import { useNavigate } from "react-router";



export default function AccountMenu() {
    const navigate = useNavigate()
    const {data : profile, isLoading: isLoadingProfile} = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: Infinity
    })

    const {data : managedRestaurant, isLoading: isLoadingManagedRestaurant} = useQuery({
        queryKey: ['managed-restaurant'],
        queryFn: getManagedRestaurant,
        staleTime: Infinity         
    })

    const { mutateAsync: signOutFn, isPending: isSigningOut} = useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            // o replace faz com que desabilite o botao de voltar
          navigate('/sign-in', {replace: true})
        }
    })


    return (
        <Dialog>
        <DropdownMenu>
            {/* o asChild passa todas as propriedades para o componente filho */}
            <DropdownMenuTrigger asChild>
            {/* select-none impossibilita que o usuário selecione o texto do botão */}
                <Button variant='outline' className="flex items-center gap-2 select-none">
                    {isLoadingManagedRestaurant ? (
                        <Skeleton className="h-4 w-40"></Skeleton>
                    ) : managedRestaurant?.name}
                    <ChevronDown className="w-4 h-4"></ChevronDown>
                </Button>

            </DropdownMenuTrigger>
            {/* o end faz abrir o menu alinhado com o final do botão */}
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                    {isLoadingProfile? (
                        <div className="space-y-1.5">
                            <Skeleton className="h-4 w-32"/>
                            <Skeleton className="h-3 w-24"/>
                        </div>
                    ) : (
                        <>
                        <span> {profile?.name} </span>
                        <span className="text-xs font-normal text-muted-foreground">{profile?.email}</span>
                        </>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DialogTrigger asChild>
                    {/* o as Child mantém a estilizacao do botão abaixo */}
                    <DropdownMenuItem>
                        <Building className="w-4 h-4 mr-2"/>
                        <span>Perfil da loja</span>
                    </DropdownMenuItem>
                </DialogTrigger>
                {/* o dark: é para setar uma configuração especifica para o tema dark */}
                <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400" disabled={isSigningOut}>
                    {/* esse button foi necessario pois no dropdown nao tem a opcao de onclick */}
                    <button className="w-full" onClick={() => signOutFn()}>
                        <LogOut className="w-4 h-4 mr-2"/>
                        <span>Sair</span>
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <StoreProfileDialog/>
        </Dialog>
    )
}