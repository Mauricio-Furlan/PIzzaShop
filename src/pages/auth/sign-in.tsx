import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner'
import { Link, useSearchParams } from "react-router";
import signIn from "@/api/sign-in";
import { useMutation } from "@tanstack/react-query";

const signInForm = z.object({
    email: z.string().email(),
})

// converte a estrutura do Zod (signInForm) para a tipagem do typescript
type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
    const [searchParams] = useSearchParams();
    // isSubmitting disponibiliza o estado do submit, bom para adicionar nos botoes 
    const { register, handleSubmit, formState: { isSubmitting} } = useForm<SignInForm>({
        defaultValues: {
            email: searchParams.get('email') ?? ''
        }
    })
    
    const { mutateAsync: authenticate } = useMutation({
        mutationFn: signIn
    })



    async function handleSignIn(data: SignInForm) {
        try {


            authenticate({email: data.email});
            toast.success('Enviamos uma notificação para o seu e-mail.', {
                action: {
                    label: 'Reenviar',
                    onClick: () => handleSignIn(data)
                }
            })
        } catch (err) {
            toast.error('Credenciais inválidas.')

        }
    }

    return (
        <>

        <Helmet title="Login"></Helmet>
        <div className="p-8">
             {/* asChild serve para o link parecer como um botão */}
            <Button variant="ghost" asChild className="absolute right-8 top-8">
                <Link to="/sign-up" className="">Novo estabelecimento</Link>
            </Button>
            <div className="w-[350px] flex flex-col justify-center gap-6">
                <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Acessar painel
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Acompanhe suas vendas pelo painel do parceiro!
                    </p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Seu e-mail</Label>
                        <Input id="email" type="email" {...register('email')}></Input>
                    </div>
                    <Button disabled={isSubmitting} type="submit" className="w-full">Acessar painel</Button>
                </form>
            </div>
        </div>
        </>
    )
}