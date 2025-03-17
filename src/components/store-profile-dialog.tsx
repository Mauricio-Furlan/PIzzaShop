import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import getManagedRestaurant, { GetManagedRestaurantResponse } from "@/api/get-manager-restaurant";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import updateProfile from "@/api/update-profile";
import { toast } from "sonner";


const storeProfileSchema = z.object({
    name: z.string().min(1),
    description: z.string(),

})

type StoreProfileSchema = z.infer<typeof storeProfileSchema>

export default function StoreProfileDialog() {
    const queryClient = useQueryClient()

    const {data : managedRestaurant} = useQuery({
        queryKey: ['managed-restaurant'],
        queryFn: getManagedRestaurant,
        // staleTime - faz sempre recarregar o fetch a partir de x segundos, infinity faz com que os dados nao atualizem
        staleTime: Infinity
    })

    function updateManagedRestaurantCache({ name, description}: StoreProfileSchema) {
        // aqui a gente ta atualizando os componentes depois de fazer um put na api, ele atualiza em tempo de execucao os campos editados
        const cached = queryClient.getQueryData<GetManagedRestaurantResponse>(['managed-restaurant'])

        if (cached) {

            // esse tipo do typescript nao é necessário...
            queryClient.setQueryData<GetManagedRestaurantResponse>(['managed-restaurant'], {
                ...cached,
                name,
                description
            })

        }
        return { cached }
    }
    const {mutateAsync: updateProfileFn} = useMutation({
        mutationFn: updateProfile,
        // onSuccess(data, {name, description}) {
            
        // },
        // onMutate atualiza os dados antes da requisição dar sucuesso
        onMutate({ name, description}) {
            const {cached} = updateManagedRestaurantCache({name, description})

            return {previousProfile: cached}
        },
        onError(error, variables, context) {
            // context recebe tudo que o onMutete retornar exemplo {previousProfile: cached}
            // aqui estamos trabalhando com interface otimista, funciona assim, voce atualiza a página com o  onMutate quando clica no botão SquareSplitVertical, e salva o cached atual antes de atualizar, se der algum problema
            // a funcao onError é chamada, então caso isso acontecer é passada para atualizar novamente a funcao com o cached anterior , voltando as condicoes iniciais
            console.log('variables::: ', variables);
            console.log('error::: ', error);
            if (context?.previousProfile) {
             
                updateManagedRestaurantCache(context?.previousProfile)
            }
            
        },
    })

    async function handleUpdateProfile(data: StoreProfileSchema) {
        try {
            await updateProfileFn({
                name: data.name,
                description: data.description
            })

            toast.success('Perfil atualizado com sucesso');
        } catch {
            toast.error('Falha ao atualizar o prefil')
        }
    }

    const {register, handleSubmit, formState: {isSubmitting}} = useForm<StoreProfileSchema>({
        resolver: zodResolver(storeProfileSchema),
        values: {
            name: managedRestaurant?.name ?? "", 
            description: managedRestaurant?.description ?? ""
        }
    })

    return (
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Perfil da loja</DialogTitle>
            <DialogDescription>
                Atualize as informações do seu estabelecimento visíveis ao seu cliente
            </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="name">Name</Label>
                    <Input className="col-span-3" id="name" {...register("name")}></Input>
                </div>
            </div>

            <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right" htmlFor="description">Descrição</Label>
                    <Textarea className="col-span-3" id="description" {...register("description")}></Textarea>
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="ghost" type="button">Cancelar</Button>
                </DialogClose>
                <Button type="submit" variant='success' disabled={isSubmitting}>Salvar</Button>
            </DialogFooter>
        </form>
    </DialogContent>
    )
}