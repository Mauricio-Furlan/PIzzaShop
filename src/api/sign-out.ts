import { api } from "@/lib/axios"


export default async function signOut() {
    await api.post('/sign-out');
}