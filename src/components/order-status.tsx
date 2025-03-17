
export type OrderStatusType = "pending" | "canceled" | "processing" | "delivering" | "delivered";

interface OrderStatusuProps {
    status: OrderStatusType
}

const orderStatusMap: Record<OrderStatusType, Array<string>> = {
    pending: ['Pendente', 'slate'],
    canceled: ['Cancelado', 'rose'],
    processing: ['Em preparo', 'amber'],
    delivering: ['Em entrega', 'amber'],
    delivered: ['Entregue', 'emerald']
}

export default function OrderStatus({ status }: OrderStatusuProps) {
    const currentStatus = orderStatusMap[status]
    const styleMark = `h-2 w-2 rounded-full bg-${currentStatus[1]}-500`
    return (
        <div className="flex items-center gap-2">
            <span className={styleMark}></span>
            <span className="font-medium text-muted-foreground">{currentStatus[0]}</span>
        </div>
    )
}