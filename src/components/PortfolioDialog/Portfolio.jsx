"use client";
import { MY_API_URL, cn, currencyFormat } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Loader from "../Loader";
import { useWatchlist } from "@/contexts/WatchlistContext";
import Trades from "../Portfolio/Trades";
import DailyChart from "../Portfolio/DailyChart";
import RunningChart from "../Portfolio/RunningChart";
import MonthlyChart from "../Portfolio/MonthlyChart";
import { EyeIcon, UserIcon } from "lucide-react";
import AssetDistribution from "../Portfolio/AssetDistribution";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InfoStats from "../Portfolio/InfoStats";
import UnauthorizedAccess from "../UnauthorizedAccess";
import { useSession } from "next-auth/react";
import { StarFilledIcon } from "@radix-ui/react-icons";

const style = {
    card : "dark:bg-slate-800 dark:border-slate-700"
}

const PortfolioDialog = ({accountId}) => {
    const session = useSession();

  const { watchlist, setWatchlist } = useWatchlist();


  const { data:account, isLoading:accountLoading, status: accountStatus } = useQuery({
    queryKey: ['accountData', accountId],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/portfolio/${accountId}`).then(res => res.json());
    },
  });

  const {data:followers} = useQuery({
    queryKey: ['followersData'],
    queryFn: async() => {
        return await fetch(`${MY_API_URL}/accounts/followers/${accountId}`).then(res => res.json());
    },
    enabled: Boolean(accountId) 
  });
  const {data:lead} = useQuery({
    queryKey: ['leadData'],
    queryFn: async() => {
        return await fetch(`${MY_API_URL}/accounts/lead/${accountId}`).then(res => res.json());
    },
    enabled: Boolean(accountId) 
  });
  const isWatchlist = watchlist?.filter(acc => acc.watchlist == accountId)?.length > 0 ? true : false;

  return (
    <>
    {session.status != "authenticated" ? <UnauthorizedAccess /> : (
        <>
            {(!followers || !account)  
                ? <div className="flex h-[90%] w-[100%] items-center justify-center"><Loader/></div> 
                : (
                    <div className="min-w-[90%] max-h-[90%]">
                        <p className="text-2xl font-bold mb-2">
                            {account?.client_name ? account?.client_name : account?.account_number}
                        </p>
                
                        <div className={`flex items-center justify-between`}>
                            <div className="flex items-center justify-start gap-2">
                                <Badge variant="secondary" className="rounded-[5px] border shadow-sm border-slate-200 bg-white dark:bg-slate-600 dark:border-slate-700">MetaTrader {account?.mt_version}</Badge>
                                <Badge variant="secondary" className="rounded-[5px] border shadow-sm border-slate-200 bg-white dark:bg-slate-600 dark:border-slate-700">{account?.copierStatus}</Badge>
                            </div>
                            {isWatchlist && 
                                <div className="w-auto">
                                    <Badge className="rounded-[5px] bg-yellow-500 w-auto flex gap-1">
                                        <StarFilledIcon/>
                                        Watchlist : {watchlist.find(w => w.watchlist == accountId).listname }
                                    </Badge>
                                </div>}
                            {/* <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="outline" className="focus:outline-0 focus:border-0 focus:ring-0">Copier</Button></DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem className="flex gap-1"><LeadIcon className="mr-3"/> Make Lead</DropdownMenuItem>
                                    <DropdownMenuItem className="flex gap-1"><FollowerIcon className="mr-3"/> Make Follower</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu> */}
                        </div>
                
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
                                <Card className={style.card}>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-md font-normal">
                                            Balance
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="font-bold text-lg">{currencyFormat(account?.balance, account?.currency)}</span>
                                    </CardContent>
                                </Card>
                                <Card className={style.card}>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-md font-normal">
                                            Growth
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="font-bold text-lg">{Number(account?.growth).toFixed(2)}%</span>
                                    </CardContent>
                                </Card>
                                <Card className={style.card}>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-md font-normal">
                                            Win Ratio
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="font-bold text-lg">{account?.total_trades != 0 && account?.total_trades_won != 0 ? Number(account?.total_trades_won / account?.total_trades * 100).toFixed(2) : 0}</span>
                                    </CardContent>
                                </Card>
                                <Card className={style.card}>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-md font-normal">
                                            RRR <span className="text-xs">(Average Loss)</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="font-bold text-lg">{account?.average_loss != 0 ? Number(account?.average_win / Math.abs(account?.average_loss)).toFixed(2) : 0}</span>
                                    </CardContent>
                                </Card>
                                {/* <Card className={style.card}>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-md font-normal">
                                            RRR <span className="text-xs">(Worst loss)</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="font-bold text-lg">{account?.worst_trade != 0 ? Number(account?.average_win / Math.abs(account?.worst_trade)).toFixed(2) : 0}</span>
                                    </CardContent>
                                </Card> */}
                                <Card className={style.card}>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-md font-normal">
                                            Drawdown
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <span className="font-bold text-lg">{account?.drawdown ? Number(account?.drawdown).toFixed(2) : 0 }%</span>
                                    </CardContent>
                                </Card>
                                {account.copierStatus == "Lead" && (
                                    <Card className={style.card}>
                                        <CardHeader className="pb-1">
                                            <CardTitle className="text-md font-normal">
                                                Followers
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <DropdownMenu className="max-h-[400px] overflow-hidden">
                                                <DropdownMenuTrigger className="w-full">
                                                    <div className="flex justify-between items-center">
                                                        <div className="font-bold text-lg">{followers ? followers.length : 0}</div>
                                                        <div className="bg-slate-100 dark:bg-slate-600 p-1 rounded-md border text-slate-500 dark:text-slate-200">
                                                            <EyeIcon className="h-5 w-5 dark:text-white"/>
                                                        </div>
                                                    </div>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="dark:bg-slate-700">
                                                    <DropdownMenuLabel>List of Followers</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    {followers.slice(0,15)?.map(f => 
                                                        <DropdownMenuItem key={f.id}>
                                                            <div className="flex gap-2">
                                                                <UserIcon className="h-5 w-5"/>
                                                                <span>{f.id}</span>
                                                            </div>
                                                        </DropdownMenuItem>
                                                    )}
                                                    {followers.length > 15 && 
                                                        <p className="text-xs pl-2 mt-2 mb-2">... {followers.length - 15} more</p>
                                                    }
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardContent>
                                    </Card>
                                )}
                                {account.copierStatus == "Follower" && lead?.length > 0 && (
                                    <Card className={style.card}>
                                        <CardHeader className="pb-1">
                                            <CardTitle className="text-md font-normal">
                                                Following
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <Link href={`/portfolio/${lead[0].lead_id}`}>
                                                <div className="font-bold text-lg flex gap-1 items-center">
                                                    <UserIcon className="h-5 w-5"/> {lead[0].lead_id}
                                                </div>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                        <div className="text-lg font-bold mb-6 mt-2">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
                                <Card className={cn(style.card, " col-span-1 lg:col-span-2")}>
                                    <CardHeader>Performance</CardHeader>
                                    <RunningChart accountId={accountId}/>
                                </Card>
                                <Card className={cn(style.card, " col-span-1 lg:col-span-2")}>
                                    <InfoStats account={account}/>
                                </Card>
                            </div>
                        </div>
                        <div className="text-lg font-bold mb-6 mt-2">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                                <Card className={cn(style.card, " col-span-1")}>
                                    <CardHeader>
                                        Monthly Growth
                                    </CardHeader>
                                    <MonthlyChart accountId={accountId}/>
                                </Card>
                                <Card className={cn(style.card, " col-span-1 ")}>
                                    <CardHeader>
                                        Monthly Chart
                                    </CardHeader>
                                    <CardContent>
                                        <AssetDistribution accountId={accountId} />
                                    </CardContent>
                                </Card>
                                <Card className={cn(style.card, " col-span-1 ")}>
                                    <CardHeader>
                                        Daily Chart
                                    </CardHeader>
                                    <CardContent>
                                        <DailyChart accountId={accountId} />
                                    </CardContent>
                                </Card>
                            </div>
                            <Card className={cn(style.card, " mt-6")}>
                                <CardContent className="p-6">
                                    <Trades key={account.id} id={account.id}/>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
            )}
        </>
    )}
    </>
  )
}

export default PortfolioDialog