import { api } from "@/lib/axios"


export interface DispatchOrderParams {
    orderId: string
}


export default async function dispatchOrder({ orderId }:DispatchOrderParams) {
    await api.patch(`/orders/${orderId}/dispatch`)
}