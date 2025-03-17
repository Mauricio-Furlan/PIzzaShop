import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { Helmet } from "react-helmet-async";
import OrderTableRow from "./order-table-row";
import OrderTableFilters from "./order-table-filters";
import Pagination from "@/components/pagination";
import { useQuery } from "@tanstack/react-query";
import getOrders from "@/api/get-order";
import { z } from "zod";
import { useSearchParams } from "react-router";
import OrderTableSkeleton from "./order-table-skeleton";


export default function Orders() {
    // paginação é o ideal trabalhar com as queryurls para preservar o estado quando houver um F5. usamos o useSearchParams para isso
    const [searchParams, setSearchParams] = useSearchParams();

    // valores dos filtros que sao adicionados na queryKey para que sempre que alterarem uma nova requisicao seja feita
    const orderId = searchParams.get('orderId') || '';
    const customerName = searchParams.get('customerName') || '';
    const status = searchParams.get('status') || 'all';


    // const pageIndex = searchParams.get('page') ?? 0
// o pageIndex esta tratando a experiencia do usuário para a url começar com 1 porém  o primeiro indice de um array é zero e isso esta sendo tratado
// coeerce tenta transformar em um numero, transforme subitrai o valor  

const pageIndex = z.coerce.number().transform(page => page - 1).parse(searchParams?.get('page') ?? '1')
    // queryId é o nome do id da requisiçõa se em outra tela voce quiser repetir essa requisicao vc coloca o mesmo id e ai ele usa o cache para prover os dados
    // o useQuery continua aplicando o cache caso o usuario avance ou retorne para uma pagina que ja foi carregada
    const { data: result, isLoading: isLoadingOrders} = useQuery({
        // o pageIndex precisa ser adicionar no queryKey pois ele é sempre alterado e quando haver alteracao precisa refazer a requisicao
        queryKey: ['orders', pageIndex, orderId, customerName, status],
        queryFn: () => getOrders({pageIndex, orderId, customerName, status: status === 'all' ? null : status})
    })


    function handlePaginate(pageIndex: number) {
        setSearchParams(currentUrl => {
            //prev é a url corrente,  o texto precisa ser convertido para string
            // resultado é url_atual?=page=1 na url
            currentUrl.set('page', (pageIndex + 1).toString())
            return currentUrl
        })

    }

    return (
        <>
        <Helmet title="Pedidos"/>
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
            <OrderTableFilters/>
        <div className="space-y-2.5">
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead  className="w-[64px]"></TableHead>
                            <TableHead  className="w-[140px]">Identificador</TableHead>
                            <TableHead  className="w-[180px]">Realizado há</TableHead>
                            <TableHead  className="w-[140px]">Status</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead  className="w-[140px]">Total de pedidos</TableHead>
                            <TableHead  className="w-[164px]"></TableHead>
                            <TableHead  className="w-[132px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingOrders && <OrderTableSkeleton/> }
                       {
                        result && result.orders.map(order => {
                            return <OrderTableRow key={order.orderId} order={order} ></OrderTableRow>
                        })
                       }
                    </TableBody>
                </Table>
                </div>
                {
                    result && (
                        <Pagination pageIndex={result.meta.pageIndex} totalCount={result.meta.totalCount} perPage={result.meta.perPage} onPageChange={handlePaginate}></Pagination>
                    )
                }
            </div>
        </div>
    </>
    )
}