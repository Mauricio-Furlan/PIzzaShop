import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner'
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import registerRestaurant from "@/api/register-restaurant";

const signUpForm = z.object({
    email: z.string().email(),
    restaurantName: z.string(),
    managerName: z.string(),
    phone: z.string()
})

// converte a estrutura do Zod (signUpForm) para a tipagem do typescript
type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
    // isSubmitting disponibiliza o estado do submit, bom para adicionar nos botoes 
    const { register, handleSubmit, formState: { isSubmitting} } = useForm<SignUpForm>()
    const navigate = useNavigate()

    const { mutateAsync: registerRestaurantFn } = useMutation({
        mutationFn: registerRestaurant
    })
    // o useNavigate é usado para redirecionar um usuário a partir de um click de um botão/submit diferente de ancora (link)
    async function handleSignUp(data: SignUpForm) {
        console.log('data::: ', data);
        try {

            await registerRestaurantFn({
                email: data.email,
                managerName: data.managerName,
                phone: data.phone,
                restaurantName: data.restaurantName
            })
            toast.success('Restaurante cadastrado com sucesso.', {
                action: {
                    label: 'Login',
                    onClick: () => navigate(`/sign-in?email=${data.email}`)
                }
            })
        } catch (err) {
            toast.error('Erro ao cadastrar restaurante.')

        }
    }

    return (
        <>
        <Helmet title="Cadastro"></Helmet>
        <div className="p-8">
            <Button variant="ghost" asChild className="absolute right-8 top-8">
                <Link to="/sign-in" className="">Fazer login</Link>
            </Button>
            <div className="w-[350px] flex flex-col justify-center gap-6">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Criar conta grátis
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Seja um parceiro e comece suas vendas!
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
                    <div className="space-y-2">
                        <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
                        <Input id="restaurantName" type="text" {...register('restaurantName')}></Input>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="managerName">Seu nome</Label>
                        <Input id="managerName" type="text" {...register('managerName')}></Input>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Seu e-mail</Label>
                        <Input id="email" type="email" {...register('email')}></Input>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Seu celular</Label>
                        <Input id="phone" type="tel" {...register('phone')}></Input>
                    </div>
                    <Button disabled={isSubmitting} type="submit" className="w-full">Finalizar cadastro</Button>
                    <p className="px-6 text-center text-sm loading-relexed text-muted-foreground">
                        Ao continuer, você concorda com o nossos <a href="#" className="underline underline-offset-4">Termos de serviços </a>{' '} e {' '} <a href="#" className="underline underline-offset-4">politicas de privacidade</a>.
                    </p>
                </form>
            </div>
        </div>
        </>
    )
}