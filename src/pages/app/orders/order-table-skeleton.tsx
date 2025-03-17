import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";


export default function OrderTableSkeleton() {

    return Array.from({length: 10}).map((_, i) => {
        <TableRow key={i}>
            <TableCell>
                <Button variant='outline' size="xs">
                    <Search className="h-3 w-3"></Search>
                    {/* sr-only funciona apenas para acessibilidade */}
                    <span className="sr-only">Detalhes do pedido</span>
                </Button>

            </TableCell>
            {/* font-mono deixa todos os ids do mesmo tamanho */}
            <TableCell className="font-mono text-xs text-medium">
                <Skeleton className="h-4 w-[172px]"></Skeleton>
                </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-[148px]"></Skeleton>
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-[110]"></Skeleton>

            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-[200px]"></Skeleton>
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-[64px]"></Skeleton>

            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-[92px]"></Skeleton>
            </TableCell>
            <TableCell>
            <       Skeleton className="h-4 w-[92px]"></Skeleton>
            </TableCell>
        </TableRow>
    })
}