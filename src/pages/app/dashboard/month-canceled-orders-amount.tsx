import getMonthCanceledOrdersAmount from "@/api/get-month-canceled-orders-amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";



export default function MonthCanceledAmountCard() {
    const {data: monthCanceledAmount} = useQuery({
        queryKey: ['metrics', 'month-canceled-orders-amount'],
        queryFn: getMonthCanceledOrdersAmount
    })
    
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-8 pb-2">
                <CardTitle className="text-base font-semibold">Cancelamentos (mês)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground"></DollarSign>
            </CardHeader>
            <CardContent className="space-y-1">
                {monthCanceledAmount && (
                <>
                    <span className="text-2xl font-bold tracking-tight">
                        {monthCanceledAmount?.amount.toLocaleString('pt-BR')}
                    </span>
                    {monthCanceledAmount.diffFromLastMonth >= 0 ? (
                        <p className="text-xs text-muted-foreground">
                            <span className="text-rose-500 dark:text-rose-400">+{monthCanceledAmount.diffFromLastMonth}%</span> em relação ao mês passado
                        </p>
                    ):(
                        <p className="text-xs text-muted-foreground">
                            <span className="text-emerald-500 dark:text-emerald-400">{monthCanceledAmount.diffFromLastMonth}%</span> em relação ao mês passado
                        </p>
                    )}
                </>

                )}
                
            </CardContent>
        </Card>
    )
}