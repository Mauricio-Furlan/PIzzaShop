import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"


export default function OrderDetailsSkeleton() {
    return (
        <div className="space-y-6">
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell className="text-muted-foreground">Status</TableCell>
                    <TableCell className="flex justify-end">
                    <Skeleton className="h-5 w-20"></Skeleton>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell className="text-muted-foreground">Cliente</TableCell>
                    <TableCell className="flex justify-end">
                    <Skeleton className="h-5 w-[164px]"></Skeleton>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell className="text-muted-foreground">Telefone</TableCell>
                    <TableCell className="flex justify-end">
                    <Skeleton className="h-5 w-[140px]"></Skeleton>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell className="text-muted-foreground">E-mails</TableCell>
                    <TableCell className="flex justify-end">
                    <Skeleton className="h-5 w-[200px]"></Skeleton>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell className="text-muted-foreground">Realizado há</TableCell>
                    <TableCell className="flex justify-end">
                    <Skeleton className="h-5 w-[168px]"></Skeleton>
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
                Array.from({length: 2}).map((_, index) => {
                    return (
                    <TableRow key={index}>
                        <TableCell>
                            <Skeleton className="h-5 w-[140px]"></Skeleton>
                        </TableCell>
                        <TableCell className="text-right">
                            {/* ml-auto = margin left auto */}
                        <Skeleton className="h-5 w-[3px] ml-auto"></Skeleton>
                        </TableCell>
                        <TableCell className="text-right">
                        <Skeleton className="h-5 w-[12px] ml-auto"></Skeleton>
                        </TableCell>
                        <TableCell className="text-right">
                        <Skeleton className="h-5 w-[12px] ml-auto"></Skeleton>
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
                <Skeleton className="h-5 w-[20px]"></Skeleton>
                </TableCell>

            </TableFooter>
        </Table>
    </div>

    )
}