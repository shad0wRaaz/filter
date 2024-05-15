import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Fragment, useState } from "react"

const TradeTable = ({data: trades}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(trades ? trades?.length / itemsPerPage : 0);

  return (
    <div className="overflow-hidden">
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Open Time</TableHead>
                <TableHead>Entry Price</TableHead>
                <TableHead>Stop Loss</TableHead>
                <TableHead>Take Profit</TableHead>
                <TableHead>Close Time</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Swap</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comment</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {trades.slice(((currentPage - 1) * itemsPerPage), ((currentPage - 1) * itemsPerPage + itemsPerPage)).map(trade => (
                    <Fragment key={trade.id}>
                        <TableRow>
                            <TableCell>{trade.ticket}</TableCell>
                            <TableCell>{trade.symbol}</TableCell>
                            <TableCell><span style={{ textTransform: "capitalize" }}>{trade.type}</span></TableCell>
                            <TableCell>{trade.lots}</TableCell>
                            <TableCell>{new Date(trade.open_time).toLocaleString()}</TableCell>
                            <TableCell>{trade.open_price}</TableCell>
                            <TableCell>{trade.stop_loss}</TableCell>
                            <TableCell>{trade.take_profit}</TableCell>
                            <TableCell>{new Date(trade.close_time).toLocaleString()}</TableCell>
                            <TableCell>{trade.commission}</TableCell>
                            <TableCell>{trade.swap}</TableCell>
                            <TableCell>{trade.profit}</TableCell>
                            <TableCell>
                                <div className="text-xs rounded-sm border p-1 text-center" style={{ textTransform: "uppercase" }}>
                                    {trade.state}
                                </div>
                            </TableCell>
                            <TableCell>{trade.comment}</TableCell>
                        </TableRow>
                    </Fragment>
                ))}
            </TableBody>
        </Table>
        <Pagination className="py-0">
            <PaginationContent>
            <PaginationItem>
                <PaginationPrevious className={`cursor-pointer ${currentPage == 1 && 'pointer-events-none cursor-not-allowed opacity-40'}`} onClick={() => setCurrentPage(cur => cur - 1)}/>
            </PaginationItem>
            {currentPage > 0 &&
                <PaginationItem>
                <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(1)} isActive={currentPage == 1 ? true : false}>1</PaginationLink>
                </PaginationItem>
            }
                <PaginationItem>
                <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(2)} isActive={currentPage == 2 ? true : false}>2</PaginationLink>
                </PaginationItem>
            {currentPage > 0 && currentPage < 4 && totalPages > 2 &&
                <PaginationItem>
                <PaginationLink className="cursor-pointer" onClick={() => setCurrentPage(3)} isActive={currentPage == 3 ? true : false}>3</PaginationLink>
                </PaginationItem>
            }
            {currentPage >= 4 && 
                <PaginationItem>
                <PaginationEllipsis />
                </PaginationItem>
            }
            {currentPage >= 4 && currentPage <= totalPages - 2 &&
                <PaginationItem>
                <PaginationLink className="cursor-pointer" isActive>{currentPage}</PaginationLink>
                </PaginationItem>
            }
            {currentPage < totalPages - 2 && totalPages > 4 &&
                <PaginationItem>
                <PaginationEllipsis />
                </PaginationItem>
            }
            {totalPages > 4 && 
                <>
                <PaginationItem>
                    <PaginationLink className="cursor-pointer" isActive={currentPage == totalPages - 1 ? true : false} onClick={() => setCurrentPage(totalPages - 1)}>{totalPages - 1}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink className="cursor-pointer" isActive={currentPage == totalPages ? true : false} onClick={() => setCurrentPage(totalPages)}>{totalPages}</PaginationLink>
                </PaginationItem>
                </>
            }
            <PaginationItem>
                <PaginationNext className={`cursor-pointer ${currentPage == totalPages && 'pointer-events-none cursor-not-allowed opacity-40'}`} onClick={() => setCurrentPage(cur => cur + 1)} />
            </PaginationItem>
            </PaginationContent>
        </Pagination>
</div>
  )
}

export default TradeTable