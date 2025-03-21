import getOrderDetails from "@/api/get-order-details";
import OrderStatus from "@/components/order-status";
import { DialogContent, DialogHeader,  DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import OrderDetailsSkeleton from "./order-details-skeleton";

export interface OrderDetailsProps {
    orderId: string
    open: boolean
}


export default function OrderDetails({orderId, open}: OrderDetailsProps) {
    // a query acontece só quando o modal for aberto, o que faz isso é o enabled recebendo o open
    const {data: order} = useQuery({
        queryKey: ['order', orderId],
        queryFn: ()=> getOrderDetails({orderId}),
        enabled: open

    })
    if (!order) {
        return null;
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Pedido: {orderId}
                </DialogTitle>
                <DialogDescription>
                    Detalhes do pedido
                </DialogDescription>
            </DialogHeader>

            {order ? (
            <div className="space-y-6">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="text-muted-foreground">Status</TableCell>
                        <TableCell className="flex justify-end">
                        <OrderStatus status={order.status}>

                        </OrderStatus>
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="text-muted-foreground">Cliente</TableCell>
                        <TableCell className="flex justify-end">
                                {order?.customer.name}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="text-muted-foreground">Telefone</TableCell>
                        <TableCell className="flex justify-end">
                            {order.customer.phone ?? 'Não informado'}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="text-muted-foreground">E-mails</TableCell>
                        <TableCell className="flex justify-end">
                        {order.customer.email}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell className="text-muted-foreground">Realizado há</TableCell>
                        <TableCell className="flex justify-end">
                            { 
                                formatDistanceToNow(order.createdAt, {
                                    locale: ptBR,
                                    addSuffix: true
                                })
                            }
                        </TableCell>
                    </TableRow>

                </TableBody>
            </Table>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Produtos
                        </TableHead>
                        <TableHead className="text-right">
                            Qtds
                        </TableHead>
                        <TableHead className="text-right">
                            Preço
                        </TableHead>
                        <TableHead className="text-right">
                            Subtotal
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {
                    order?.orderItems.map(item => {
                        return (
                        <TableRow key={item.key}>
                            <TableCell>
                                {item.product.name}
                            </TableCell>
                            <TableCell className="text-right">
                                {item.quantity}
                            </TableCell>
                            <TableCell className="text-right">
                                {(item.priceInCents / 100).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </TableCell>
                            <TableCell className="text-right">
                            {(item.priceInCents * item.quantity / 100).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                            </TableCell>
                        </TableRow>
                        )
                    })
                   }
                </TableBody>
                <TableFooter>
                    {/* ocupa 3 celulas */}
                    <TableCell colSpan={3}> Total do pedido</TableCell>
                    <TableCell className="text-right font-medium">
                        {(order.totalInCents / 100).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                    </TableCell>

                </TableFooter>
            </Table>
        </div>
            ) : <OrderDetailsSkeleton/>}

        </DialogContent>
    )
}