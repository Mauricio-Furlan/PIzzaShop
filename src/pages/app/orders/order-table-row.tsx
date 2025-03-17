import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import { ArrowRight, Search, X } from "lucide-react";
import OrderDetails from "./order-details";
import OrderStatus, { OrderStatusType } from "@/components/order-status";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from "react";
import cencelOrder from "@/api/cancel-order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GetOrdersResponse } from "@/api/get-order";
import approveOrder from "@/api/approve-order";
import deliverOrder from "@/api/deliver-order";
import dispatchOrder from "@/api/dispatch-order";



export interface OrderTableRowsProps {
    order: {
        orderId: string;
        createdAt: string;
        status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
        customerName: string;
        total: number;
    }
}

export default function OrderTableRow({order}: OrderTableRowsProps) {
    // esse estado foi criado pois o dialog do radix renderiza tudo mesmo sem que o dialog seja aberto, fazendo com que ele faça requisicoes desnecessária
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const queryClient = useQueryClient()

    function updateOrderStatusOnCache(orderId: string, status: OrderStatusType ) {
        const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
            // getQueriesData busca todas as queries que tiverem a key orders
            queryKey: ['orders']
        })
        ordersListCache.forEach(([cacheKey, cacheData]) => {
            if (!cacheData) return;

            queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
                    ...cacheData,
                    orders: cacheData.orders.map(order => {
                        if (order.orderId == orderId) {
                            return { ...order, status: status}
                        }
                        return order;
                    })
                }
            )
        })
    }

    const {mutateAsync: cancelOrderFn, isPending: isCanceledOrder} = useMutation({
      mutationFn: cencelOrder,
    //   aqui estamos atualização o botão cancelar depois que ele for clicado pois ele tem que passar a ficar disabled
      async onSuccess(_, {orderId}) {
        // percorre todas as listas carregadas (lista de pedidio, filtradas) cacheada , e quando encontra o id clicado ele atualiza para cancelada
        updateOrderStatusOnCache(orderId, 'canceled')
      }
    })

    const {mutateAsync: approveOrderFn, isPending: isApprovingOrder} = useMutation({
        mutationFn: approveOrder,
        async onSuccess(_, {orderId}) {
          updateOrderStatusOnCache(orderId, 'processing')
        }
      })
      
    const {mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } = useMutation({
        mutationFn: dispatchOrder,
        async onSuccess(_, {orderId}) {
        updateOrderStatusOnCache(orderId, 'delivering')
        }
    })

      const {mutateAsync: deliverOrderFn, isPending: isDeliveringOrder} = useMutation({
        mutationFn: deliverOrder,
        async onSuccess(_, {orderId}) {
          updateOrderStatusOnCache(orderId, 'delivered')
        }
      })




    return (
        <TableRow>
            <TableCell>
                <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                    <DialogTrigger asChild>
                        <Button variant='outline' size="xs">
                            <Search className="h-3 w-3"></Search>
                            {/* sr-only funciona apenas para acessibilidade */}
                            <span className="sr-only">Detalhes do pedido</span>
                        </Button>
                    </DialogTrigger>

                    <OrderDetails orderId={order.orderId} open={isDetailsOpen}/>
                    
                </Dialog>
            </TableCell>
            {/* font-mono deixa todos os ids do mesmo tamanho */}
            <TableCell className="font-mono text-xs text-medium">{order.orderId}</TableCell>
            <TableCell className="text-muted-foreground">
                {formatDistanceToNow(order.createdAt, {
                    locale: ptBR,
                    addSuffix: true
                })}
            </TableCell>
            <TableCell>
                <OrderStatus status={order.status}></OrderStatus>
            </TableCell>
            <TableCell className="font-medium">{order.customerName}</TableCell>
            <TableCell className="font-medium">{(order.total / 100).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}</TableCell>
            <TableCell>
                {
                    order.status == 'pending' && (
                    <Button disabled={isApprovingOrder} variant='outline' size="xs" onClick={() => approveOrderFn({orderId: order.orderId})}>
                        <ArrowRight className="h-3 w-3 mr-2"></ArrowRight>
                        Aprovar
                    </Button>
                    )
                }
                {
                    order.status == 'processing' && (
                        <Button disabled={isDispatchingOrder} variant='outline' size="xs" onClick={() => dispatchOrderFn({orderId: order.orderId})}>
                            <ArrowRight className="h-3 w-3 mr-2"></ArrowRight>
                            Em entrega
                        </Button>
                        )
                }
                                {
                    order.status == 'delivering' && (
                        <Button disabled={isDeliveringOrder} variant='outline' size="xs" onClick={() => deliverOrderFn({orderId: order.orderId})}>
                            <ArrowRight className="h-3 w-3 mr-2"></ArrowRight>
                            Entregue
                        </Button>
                        )
                }
            </TableCell>
            <TableCell>
            <Button disabled={!['pending', 'processing'].includes(order.status) || isCanceledOrder} variant='ghost' size="xs" onClick={()=>cancelOrderFn({orderId: order.orderId})}>
                <X className="h-3 w-3 mr-2"></X>
                Cencelar
            </Button>
            </TableCell>
        </TableRow>
    )
}