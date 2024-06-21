import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Fragment, useEffect, useState } from "react"
import TradeFilterControl from "./TradeFilterControl";

const TradeTable = ({data: trades}) => {
    const [selectedTrades, setSelectedTrades] = useState(trades);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [tradeState, setTradeState] = useState('All');
    const [tradeType, setTradeType] = useState('All');
    const [totalPages, setTotalPages] = useState(trades ? Math.ceil(trades?.length / itemsPerPage) : 0);
    const [date, setDate] = useState();

    const type = trades?.map(tr => tr.type);
    const typeSet = new Set(type);
    const uniqueTypes = Array.from(typeSet);


    useEffect(() => {
        let selTrades = trades;
        if(tradeState != "All"){
            selTrades = selTrades.filter(tr => tr.state == tradeState);
        }

        if(tradeType != "All"){
            selTrades = selTrades.filter(tr => tr.type == tradeType);
        }
        
        if(date){
            selTrades = selTrades.filter(tr => new Date(date.from).getTime() < new Date(tr.open_time).getTime() && new Date(date.to).getTime() > new Date(tr.open_time)); 
        }

        setSelectedTrades(selTrades);
        setTotalPages(Math.ceil(selTrades.length / itemsPerPage));

        return() => {}
    }, [tradeState, tradeType, currentPage, date]);

  return (
    <div className="overflow-hidden">
        <TradeFilterControl 
            date={date}
            setDate={setDate}
            tradeState={tradeState} 
            setTradeState={setTradeState} 
            tradeType={tradeType}
            setTradeType={setTradeType}
            uniqueTypes={uniqueTypes}
        />
        <Table>
            <TableHeader className="dark:bg-slate-700">
                <TableRow>
                    <TableHead className="rounded-l-sm">Ticket</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Opened Date</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Stop Loss</TableHead>
                    <TableHead>Take Profit</TableHead>
                    <TableHead>Closed Date</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Swap</TableHead>
                    <TableHead>Profit</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="rounded-r-sm">Comment</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {selectedTrades.length == 0 && 
                    <TableRow>
                        <TableCell colSpan="15">
                            <p className="text-center">No Trades Found</p>
                        </TableCell>
                    </TableRow>
                }
                {selectedTrades.slice(((currentPage - 1) * itemsPerPage), ((currentPage - 1) * itemsPerPage + itemsPerPage)).map(trade => (
                    <Fragment key={trade.id}>
                        <TableRow>
                            <TableCell>{trade.ticket}</TableCell>
                            <TableCell>{trade.symbol}</TableCell>
                            <TableCell><span style={{ textTransform: "capitalize" }}>{trade.type}</span></TableCell>
                            <TableCell>{trade.lots}</TableCell>
                            <TableCell>{new Date(trade.open_time).toDateString()}</TableCell>
                            <TableCell>{trade.open_price}</TableCell>
                            <TableCell>{trade.stop_loss}</TableCell>
                            <TableCell>{trade.take_profit}</TableCell>
                            <TableCell>{!trade.close_time ? "" : new Date(trade.close_time).toDateString()}</TableCell>
                            <TableCell>{trade.commission}</TableCell>
                            <TableCell>{trade.swap}</TableCell>
                            <TableCell>{trade.profit}</TableCell>
                            <TableCell>
                                <div className="text-xs dark:border-slate-600 rounded-sm border p-1 px-2 text-center" style={{ textTransform: "uppercase" }}>
                                    {trade.state}
                                </div>
                            </TableCell>
                            <TableCell>{trade.comment}</TableCell>
                        </TableRow>
                    </Fragment>
                ))}
            </TableBody>
        </Table>
        {totalPages > 10 && (
            <div className="pt-4">
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
        )}
</div>
  )
}

export default TradeTable