import { api } from "@/lib/axios"


export interface SignInBody {
    email: string
}

export default async function signIn({email}: SignInBody) {
    await api.post('/authenticate', { email });
}