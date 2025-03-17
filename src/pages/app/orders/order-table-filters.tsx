import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select,  SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";


import { Search, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { z } from "zod";

export const orderFiltersSchema = z.object({
    orderId: z.string().optional(),
    customerName: z.string().optional(),
    status: z.string().optional(),
})

// z.infer é para criar o tipo automaticamente no useForm
type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>

export default function OrderTableFilters() {
    // é interessante que os filtros fiquem salvos na url entao usar o useSearchParams
    const [searchParams, setSearchParams ] = useSearchParams();

    const orderId = searchParams.get('orderId') || '';
    const customerName = searchParams.get('customerName') || '';
    const status = searchParams.get('status') || 'all';


    const { register, handleSubmit, control, reset} = useForm<OrderFiltersSchema>({
        resolver: zodResolver(orderFiltersSchema),
        defaultValues: {
            orderId,
            customerName,
            status,
        }
    })

    function handleFilter ({ orderId, customerName, status }: OrderFiltersSchema) {
        setSearchParams(currentUrl => {
            if (orderId) {
                currentUrl.set('orderId', orderId);
            } else {
                currentUrl.delete('orderId');
            }

            if (customerName) {
                currentUrl.set('customerName', customerName);
            } else {
                currentUrl.delete('customerName');
            }

            if (status) {
                currentUrl.set('status', status)
            } else {
                currentUrl.delete('status');
            }

            // importante voltar para a pagina 1 pois a order muda quando os filtros acontecem
            currentUrl.set('page', '1');

            return currentUrl;
        })
    }

    function handleClearFilters() {
        setSearchParams(currentUrl => {
            currentUrl.delete('orderId');
            currentUrl.delete('status');
            currentUrl.delete('customerName')
            currentUrl.set('page', '1')
            return currentUrl;
        })
        
        reset({
            customerName: '',
            orderId: '',
            status: 'all'
        });
    }


    return (
    <form onSubmit={handleSubmit(handleFilter)} className="flex items-center gap-2">
        <span className="text-sm font-semibold">Filtros</span>
        <Input placeholder="ID do pedido" className="h-8 w-auto" {...register('orderId')}/>
        <Input placeholder="Nome do cliente" className="h-8 w-[320px]" {...register('customerName')}/>
        {/* O select do radix nao funciona o register, por isso usa o controller e o control */}
        <Controller name="status" control={control} render={({field: {name, onChange, value, disabled}}) => {
            return (
                <Select defaultValue="all" name={name} onValueChange={onChange} value={value} disabled={disabled}>
                    <SelectTrigger className="h-8 w-[180px]">
                        <SelectValue placeholder="Todos status"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos status</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="canceled">Cancelado</SelectItem>
                        <SelectItem value="processing">Em preparo</SelectItem>
                        <SelectItem value="delivering">Em entrega</SelectItem>
                        <SelectItem value="delivered">Entregue</SelectItem>
                    </SelectContent>
                </Select>
            )
        }}>
        </Controller>


        <Button type="submit" variant="secondary" size="xs">
            <Search className="h-4 w-4 mr-2"></Search>
            Filtrar resultados
        </Button>
        <Button type="button" variant="outline" size="xs" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2"></X>
            Remover filtros
        </Button>
    </form>
    )
}