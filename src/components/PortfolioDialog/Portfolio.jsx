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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InfoStats from "../Portfolio/InfoStats";

const PortfolioDialog = ({accountId}) => {

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
        {(!followers || !account)  
            ? <div className="flex h-[90%] w-[100%] items-center justify-center"><Loader/></div> 
            : (
                <div className="min-w-[90%] max-h-[90%]">
                    <p className="text-2xl font-bold mb-2">
                        {account?.client_name ? account?.client_name : account?.account_number}
                    </p>
            
                    <div className={`flex items-center justify-between`}>
                        <div className="flex items-center justify-start gap-2">
                            <Badge variant="secondary" className="rounded-[5px] border shadow-sm border-slate-200 dark:bg-slate-600 dark:border-slate-700">MetaTrader {account?.mt_version}</Badge>
                            <Badge variant="secondary" className="rounded-[5px] border shadow-sm border-slate-200 dark:bg-slate-600 dark:border-slate-700">{account?.copierStatus}</Badge>
                        </div>
                        {isWatchlist && <div className="w-auto"><Badge className="rounded-[5px] bg-yellow-500 w-auto">In Watchlist</Badge></div>}
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
                            <Card>
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-md font-normal">
                                        Balance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="font-bold text-lg">{currencyFormat(account?.balance, account?.currency)}</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-md font-normal">
                                        Growth
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="font-bold text-lg">{Number(account?.growth).toFixed(2)}%</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-md font-normal">
                                        Win Ratio
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="font-bold text-lg">{account?.total_trades != 0 && account?.total_trades_won != 0 ? Number(account?.total_trades_won / account?.total_trades * 100).toFixed(2) : 0}</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-md font-normal">
                                        RRR <span className="text-xs">(Average Loss)</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="font-bold text-lg">{account?.average_loss != 0 ? Number(account?.average_win / Math.abs(account?.average_loss)).toFixed(2) : 0}</span>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="pb-1">
                                    <CardTitle className="text-md font-normal">
                                        RRR <span className="text-xs">(Worst loss)</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <span className="font-bold text-lg">{account?.worst_trade != 0 ? Number(account?.average_win / Math.abs(account?.worst_trade)).toFixed(2) : 0}</span>
                                </CardContent>
                            </Card>
                            <Card>
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
                                <Card>
                                    <CardHeader className="pb-1">
                                        <CardTitle className="text-md font-normal">
                                            Followers
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="w-full">
                                                <div className="flex justify-between items-center">
                                                    <div className="font-bold text-lg">{followers ? followers.length : 0}</div>
                                                    <div className="bg-slate-100 p-1 rounded-md border text-slate-500">
                                                        <EyeIcon className="h-5 w-5"/>
                                                    </div>
                                                </div>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>List of Followers</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                {followers?.map(f => 
                                                    <DropdownMenuItem key={f.id}>
                                                        <div className="flex gap-2">
                                                            <UserIcon className="h-5 w-5"/>
                                                            <span>{f.id}</span>
                                                        </div>
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardContent>
                                </Card>
                            )}
                            {account.copierStatus == "Follower" && lead?.length > 0 && (
                                <Card>
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
                            <Card className="col-span-1 lg:col-span-2">
                                <CardHeader>Performance</CardHeader>
                                <RunningChart accountId={accountId}/>
                            </Card>
                            <Card className="col-span-1 lg:col-span-2">
                                <InfoStats account={account}/>
                            </Card>
                        </div>
                    </div>
                    <div className="text-lg font-bold mb-6 mt-2">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-4">
                            <Card className="col-span-1 lg:col-span-2">
                                <Carousel>
                                    <CarouselContent className="py-4">
                                        <CarouselItem>
                                            <Card className="shadow-none border-0">
                                                <CardHeader>Monthly Growth</CardHeader>
                                                <MonthlyChart accountId={accountId}/>
                                            </Card>
                                        </CarouselItem>
                                        <CarouselItem>
                                            <Card className="shadow-none border-0">
                                                <CardHeader>
                                                    Monthly Chart
                                                </CardHeader>
                                                <CardContent>
                                                    <AssetDistribution accountId={accountId} />
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    </CarouselContent>
                                    <div className="flex justify-center absolute w-full">
                                        <CarouselPrevious className="left-[10px] relative"/>
                                        <CarouselNext className="-right-[15px] relative"/>
                                    </div>
                                </Carousel>
                            </Card>
                            <Card className="col-span-1 lg:col-span-2">
                                <CardHeader>
                                    Daily Chart
                                </CardHeader>
                                <CardContent>
                                    <DailyChart accountId={accountId} />
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <Trades key={account.id} id={account.id}/>
                            </CardContent>
                        </Card>
                    </div>
                </div>
        )}
    </>
  )
}

export default PortfolioDialog