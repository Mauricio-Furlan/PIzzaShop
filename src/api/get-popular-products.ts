import { api } from "@/lib/axios";

// aqui é usado type pq é a a unica forma de retornar um array no top level
export type GetPopularProductsResponse = {
    product: string
    amount: number
}[]

export default async function getPopularProducts() {
    const response = await api.get<GetPopularProductsResponse>('/metrics/popular-products');

    return response.data;
}