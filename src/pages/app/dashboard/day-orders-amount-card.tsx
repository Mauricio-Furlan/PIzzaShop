import getDayOrdersAmount from "@/api/get-day-orders-amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Utensils } from "lucide-react";
import MetricCardSkeleton from "./metric-card-skeleton";



export default function DayOrderAmountCard() {
        // use query padrão para fazer um get
        const {data: dayOrdersAmount} = useQuery({
            queryKey: ['metrics', 'day-orders-amount'],
            queryFn: getDayOrdersAmount
        })

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-8 pb-2">
                <CardTitle className="text-base font-semibold">Pedidos (dia)</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground"></Utensils>
            </CardHeader>
            <CardContent className="space-y-1">
            { dayOrdersAmount ? (
                   <>
                    <span className="text-2xl font-bold tracking-tight">
                        {dayOrdersAmount.amount.toLocaleString('pt-BR')}
                    </span>
                    <p className="text-xs text-muted-foreground">
                    {dayOrdersAmount.diffFromYesterday >= 0 ? (
                        <>
                            <span className="text-emerald-500 dark:text-emerald-400">+{dayOrdersAmount.diffFromYesterday}%
                            </span>{' '} em relação ao mês passado
                        </>
                    ): (
                        <>
                        <span className="text-rose-500 dark:text-rose-400">{dayOrdersAmount.diffFromYesterday}%
                        </span>{' '} em relação ao mês passado
                        </>
                    )}
                </p>
                   </> 
                ) : <MetricCardSkeleton/>}
            </CardContent>
        </Card>
    )
}