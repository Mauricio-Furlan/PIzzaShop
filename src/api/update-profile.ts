import { api } from "@/lib/axios";


interface UpdateProfileBody {
    name: string
    description: string
}

export default async function updateProfile({name, description}: UpdateProfileBody) {
    await api.put('/profile', {
        name,
        description
    })
}