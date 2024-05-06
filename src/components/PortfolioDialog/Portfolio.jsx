"use client";
import { Button } from "@/components/ui/button"
import { EyeOpenIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { MY_API_URL, cn, currencyFormat } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FollowerIcon, LeadIcon } from "@/components/icons/CustomIcons";
import Loader from "../Loader";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { UserIcon } from "lucide-react";

const PortfolioDialog = ({accountId}) => {
  const {user} = useUser();
  const { watchlist, setWatchlist } = useWatchlist();


  const { data:account, isLoading:accountLoading, status: accountStatus } = useQuery({
    queryKey: ['account', accountId],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/portfolio/${accountId}`).then(res => res.json());
    },
    enabled: Boolean(accountId)
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
  console.log(lead)
  
  const isWatchlist = watchlist?.filter(acc => acc.watchlist == accountId)?.length > 0 ? true : false;



  const { data:trades, isLoading:tradesLoading, status: tradeStatus } = useQuery({
    queryKey: ['trades', accountId],
    queryFn: async() => {
      return await fetch(`${MY_API_URL}/trades`, {
        method: "POST",
        body: JSON.stringify({ 
          ak: user.apiKey,
          sk: user.secretKey,
          ai: accountId,
          type: "fetch"
        })
      }).then(res => res.json());
    },
    enabled: user.secretKey != '' && user.apiKey != '' && Boolean(accountId) && false
  });

  return (
    <>
        {!followers || !account ? <div className="flex h-[100%] w-[100%] items-center justify-center"><Loader/></div> : (
            <div className="min-w-[90%] min-h-[90%]">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
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
                                <span className="font-bold text-lg">{currencyFormat(account?.growth)}</span>
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
                                    <span className="font-bold text-lg">{followers ? followers.length : 0}</span>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
                <div className="text-lg font-bold">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader>
                            Performance Chart
                            </CardHeader>
                        </Card>
                        <Card className={`col-span-1 ${account.copierStatus == "Standalone" ? " lg:col-span-2" : ""}`}>
                            <CardHeader>
                                Asset Distribution
                        </CardHeader>
                        </Card>
                        {account.copierStatus == "Lead" && (
                            <Card>
                                <CardHeader className="pb-1">
                                    Followers
                                </CardHeader>
                                <CardContent className="space-y-1">
                                    {followers && followers?.map(copier => 
                                        <div key={copier.follower_id} className="text-base font-normal flex gap-1 items-center"><UserIcon className="h-4 w-4"/> {copier.follower_id}</div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                        {account.copierStatus == "Follower" && lead?.length > 0 && (
                            <Card>
                                <CardHeader className="pb-1">
                                    Following
                                </CardHeader>
                                <CardContent>
                                    <div className="text-base font-normal flex gap-1"><UserIcon className="h-5 w-5"/> {lead[0].lead_id}</div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <Card>
                    <CardHeader>
                        Latest Trades
                    </CardHeader>
                    </Card>
                </div>
        
        
            </div>
        )}
    </>

    // <Sheet 
    //   open
    //   onOpenChange={isOpen => {if(!isOpen) { handleDismiss(); }}}>
    //   {/* <SheetTrigger asChild>
    //     <div className="flex gap-1 items-center cursor-pointer">
    //         {type == "link" && (
    //           <>
    //             {account.client_name} {isWatchlist && <StarFilledIcon color="#f9a825" className="transition-all hover:rotate-90 duration-500" />}
    //           </>
    //         )}
    //         {type == "button" && (
    //           <>
    //             <EyeOpenIcon className="w-4 h-4 mr-2"/> View Portfolio
    //           </>
    //         )}
    //     </div>
    //   </SheetTrigger> */}
    //   {account && (

    //   <SheetContent side="bottom" className="h-full p-10 bg-gray-100 dark:bg-gray-800">
    //     <SheetHeader>
    //       <SheetTitle> {account.client_name}</SheetTitle>
    //       <div className={`flex items-center ${isWatchlist ? "justify-between": "justify-end"}`}>
    //         {isWatchlist && <div className="w-auto"><Badge className="rounded-[5px] bg-yellow-500 w-auto">In Watchlist</Badge></div>}
    //         <DropdownMenu>
    //           <DropdownMenuTrigger>
    //             <Button variant="outline" className="focus:outline-0 focus:border-0 focus:ring-0">Copier</Button></DropdownMenuTrigger>
    //           <DropdownMenuContent>
    //             <DropdownMenuItem className="flex gap-1"><LeadIcon className="mr-3"/> Make Lead</DropdownMenuItem>
    //             <DropdownMenuItem className="flex gap-1"><FollowerIcon className="mr-3"/> Make Follower</DropdownMenuItem>
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </div>
    //     </SheetHeader>
        // <div className="grid gap-4 py-4">
        //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        //         <Card>
        //             <CardHeader className="pb-1">
        //                 <CardTitle className="text-md font-normal">
        //                     Balance
        //                 </CardTitle>
        //             </CardHeader>
        //             <CardContent>
        //                 <span className="font-bold text-lg">{currencyFormat(account.balance)}</span>
        //             </CardContent>
        //         </Card>
        //         <Card>
        //             <CardHeader className="pb-1">
        //                 <CardTitle className="text-md font-normal">
        //                     Growth
        //                 </CardTitle>
        //             </CardHeader>
        //             <CardContent>
        //                 <span className="font-bold text-lg">{currencyFormat(account.growth)}</span>
        //             </CardContent>
        //         </Card>
        //         <Card>
        //             <CardHeader className="pb-1">
        //                 <CardTitle className="text-md font-normal">
        //                     Win Ratio
        //                 </CardTitle>
        //             </CardHeader>
        //             <CardContent>
        //                 <span className="font-bold text-lg">{currencyFormat(account.win_ratio)}</span>
        //             </CardContent>
        //         </Card>
        //         <Card>
        //             <CardHeader className="pb-1">
        //                 <CardTitle className="text-md font-normal">
        //                     RRR <span className="text-xs">(Average Loss)</span>
        //                 </CardTitle>
        //             </CardHeader>
        //             <CardContent>
        //                 <span className="font-bold text-lg">{currencyFormat(account.risk_reward_ratio_avg)}</span>
        //             </CardContent>
        //         </Card>
        //         <Card>
        //             <CardHeader className="pb-1">
        //                 <CardTitle className="text-md font-normal">
        //                     RRR <span className="text-xs">(Worst loss)</span>
        //                 </CardTitle>
        //             </CardHeader>
        //             <CardContent>
        //                 <span className="font-bold text-lg">{currencyFormat(account.risk_reward_ratio_worst)}</span>
        //             </CardContent>
        //         </Card>
        //         <Card>
        //             <CardHeader className="pb-1">
        //                 <CardTitle className="text-md font-normal">
        //                     Drawdown
        //                 </CardTitle>
        //             </CardHeader>
        //             <CardContent>
        //                 <span className="font-bold text-lg">{currencyFormat(account.drawdown)}%</span>
        //             </CardContent>
        //         </Card>
        //         <Card>
        //             <CardHeader className="pb-1">
        //                 <CardTitle className="text-md font-normal">
        //                     Followers
        //                 </CardTitle>
        //             </CardHeader>
        //             <CardContent>
        //                 <span className="font-bold text-lg">15</span>
        //             </CardContent>
        //         </Card>
        //     </div>
        // </div>
        // <div className="text-lg font-bold">
        //   <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
        //     <Card className="col-span-1 lg:col-span-2">
        //       <CardHeader>
        //         Performance Chart
        //       </CardHeader>
        //     </Card>
        //       <Card>
        //         <CardHeader>
        //           Asset Distribution
        //         </CardHeader>
        //       </Card>
        //       <Card>
        //         <CardHeader>
        //           Followers
        //         </CardHeader>
        //       </Card>
        //   </div>
        //   <Card>
        //     <CardHeader>
        //       Latest Trades
        //     </CardHeader>
        //   </Card>
        // </div>
    //     <SheetFooter>
    //       <SheetClose asChild>

    //       </SheetClose>
    //     </SheetFooter>
    //   </SheetContent>
    //   )}
    // </Sheet>
  )
}

export default PortfolioDialog