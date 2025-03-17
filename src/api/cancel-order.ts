import { api } from "@/lib/axios"


export interface CancelOrderParams {
    orderId: string
}


export default async function cencelOrder({ orderId }:CancelOrderParams) {
    await api.patch(`/orders/${orderId}/cancel`)
}