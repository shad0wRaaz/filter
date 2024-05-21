import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn, currencyFormat } from '@/lib/utils'

const style = {
    cell: "p-2 py-4",
}

const InfoStats = ({ account }) => {

  return (
    <Tabs defaultValue="stats" className="w-full p-4">
        <TabsList>
            <TabsTrigger value="stats">Trading Stats</TabsTrigger>
            <TabsTrigger value="account">Account Info</TabsTrigger>
        </TabsList>
        <TabsContent value="stats" className="p-2">
            <Table>
                <TableBody>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Total Trades</TableCell>
                        <TableCell className={style.cell}>{account.total_trades}</TableCell>
                        <TableCell className={style.cell}>Lots</TableCell>
                        <TableCell className={style.cell}>{account.total_lots}</TableCell>
                    </TableRow>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Commissions</TableCell>
                        <TableCell className={style.cell}>{account.total_commission}</TableCell>
                        <TableCell className={style.cell}>Swap</TableCell>
                        <TableCell className={style.cell}>{account.total_swap}</TableCell>
                    </TableRow>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Win Rate</TableCell>
                        <TableCell className={style.cell}>{Number(account.win_ratio).toFixed(2)}</TableCell>
                        <TableCell className={style.cell}>Loss Rate</TableCell>
                        <TableCell className={style.cell}>{Number(100 - account.win_ratio).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Best Trade</TableCell>
                        <TableCell className={style.cell}>{Number(account.best_trade).toFixed(2)} <span className="text-xs">({account.best_trade_date})</span></TableCell>
                        <TableCell className={style.cell}>Worst Trade</TableCell>
                        <TableCell className={style.cell}>{Number(account.worst_trade).toFixed(2)} <span className="text-xs">({account.worst_trade_date})</span></TableCell>
                    </TableRow>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Longs Won</TableCell>
                        <TableCell className={style.cell}>{account.longs_won}</TableCell>
                        <TableCell className={style.cell}>Shorts Won</TableCell>
                        <TableCell className={style.cell}>{account.shorts_won}</TableCell>
                    </TableRow>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Total Trades Won</TableCell>
                        <TableCell className={style.cell}>{account.total_trades_won}</TableCell>
                        <TableCell className={style.cell}>Total Trades Lost</TableCell>
                        <TableCell className={style.cell}>{account.total_trades_lost}</TableCell>
                    </TableRow>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Average Win</TableCell>
                        <TableCell className={style.cell}>{Number(account.average_win).toFixed(2)}</TableCell>
                        <TableCell className={style.cell}>Average Loss</TableCell>
                        <TableCell className={style.cell}>{Number(account.average_loss).toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            
        </TabsContent>
        <TabsContent value="account" className="p-2">
            <Table>
                <TableBody>
                    {/* <TableRow className="font-normal">
                        <TableCell colSpan="4" className={cn(style.cell, "text-center")}>
                            <span>Balance: </span>
                            <span className="text-lg ml-4">
                                {currencyFormat(account?.balance, account?.currency)}
                            </span>
                        </TableCell>
                    </TableRow> */}
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Deposits</TableCell>
                        <TableCell className={style.cell}>{currencyFormat(account.total_deposits, account.currency)}</TableCell>
                        <TableCell className={style.cell}>Withdrawals</TableCell>
                        <TableCell className={style.cell}>{currencyFormat(account.total_withdrawals, account.currency)}</TableCell>
                    </TableRow>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Account Type</TableCell>
                        <TableCell className={style.cell}><span className="capitalize">{account.trade_mode}</span></TableCell>
                        <TableCell className={style.cell}>Leverage</TableCell>
                        <TableCell className={style.cell}>{account.leverage} : 1</TableCell>
                    </TableRow>
                    <TableRow className="font-normal">
                        <TableCell className={style.cell}>Broker</TableCell>
                        <TableCell className={style.cell}>{account.broker}</TableCell>
                        <TableCell className={style.cell}>Server</TableCell>
                        <TableCell className={style.cell}>{account.server}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TabsContent>
    </Tabs>
  )
}

export default InfoStats