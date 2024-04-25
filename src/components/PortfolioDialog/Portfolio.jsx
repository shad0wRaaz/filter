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

const PortfolioDialog = ({accountId}) => {
  const {user} = useUser();
  var isWatchlist = true;

  const { data:account, isLoading:accountLoading, status: accountStatus } = useQuery({
    queryKey: ['account', accountId],
    queryFn: async() => {
      // if(user.secretKey == '' || user.apiKey ==  '' || Boolean(accountId)){ return null; }
      return await fetch(`${MY_API_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify({ 
          ak: user.apiKey,
          sk: user.secretKey,
          ai: accountId
        })
      }).then(res => res.json());
    },
    enabled: user.secretKey != '' && user.apiKey != '' && Boolean(accountId)
  });


  const { data:trades, isLoading:tradesLoading, status: tradeStatus } = useQuery({
    queryKey: ['trades', accountId],
    queryFn: async() => {
      // if(user.secretKey == '' || user.apiKey ==  '' || Boolean(accountId)){ return null; }
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
    enabled: user.secretKey != '' && user.apiKey != '' && Boolean(accountId)
  });
  console.log(trades)
  const { data: dailyData, isLoading, status } = useQuery({
    queryKey: ['dailyData', accountId],
    queryFn: async() => {

      return await fetch(`${MY_API_URL}/analyses`, {
        method: "POST",
        body: JSON.stringify({
          type: "daily",
          ak: user.apiKey,
          sk: user.secretKey,
          ai: accountId
        })
      })
        .then(res => res.json());
    },
    enabled: user.secretKey != '' && user.apiKey != '' && !!accountId
  });
  const { data: analysisData, isLoading:analysisLoading, status:analysisStatus } = useQuery({
    queryKey: ['analysisdata', accountId],
    queryFn: async() => {

      return await fetch(`${MY_API_URL}/analyses`, {
        method: "POST",
        body: JSON.stringify({
          type: "normal",
          ak: user.apiKey,
          sk: user.secretKey,
          ai: accountId
        })
      })
        .then(res => res.json());
    },
    enabled: user.secretKey != '' && user.apiKey != '' && !!accountId
  });

  return (
    <div className="min-w-[90%] min-h-[90%]">
        {account?.data?.client_name}

        <div className={`flex items-center ${isWatchlist ? "justify-between": "justify-end"}`}>
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
                        <span className="font-bold text-lg">{currencyFormat(account?.data.balance)}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-normal">
                            Growth
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="font-bold text-lg">{currencyFormat(analysisData?.data.growth)}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-normal">
                            Win Ratio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="font-bold text-lg">{analysisData?.data.total_trades != 0 && analysisData?.data.total_trades_won != 0 ? Number(analysisData?.data.total_trades_won / analysisData?.data.total_trades * 100).toFixed(2) : 0}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-normal">
                            RRR <span className="text-xs">(Average Loss)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="font-bold text-lg">{analysisData?.data.average_loss != 0 ? Number(analysisData?.data.average_win / Math.abs(analysisData?.data.average_loss)).toFixed(2) : 0}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-normal">
                            RRR <span className="text-xs">(Worst loss)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="font-bold text-lg">{analysisData?.data.worst_trade != 0 ? Number(analysisData?.data.average_win / Math.abs(analysisData?.data.worst_trade)).toFixed(2) : 0}</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-normal">
                            Drawdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="font-bold text-lg">{Number((Number(account?.data.balance) - Number(account?.data.equity)) / Number(account?.data.balance) * 100).toFixed(2)}%</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardTitle className="text-md font-normal">
                            Followers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <span className="font-bold text-lg">15</span>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="text-lg font-bold">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                Performance Chart
                </CardHeader>
            </Card>
                <Card>
                <CardHeader>
                    Asset Distribution
                </CardHeader>
                </Card>
                <Card>
                <CardHeader>
                    Followers
                </CardHeader>
                </Card>
            </div>
            <Card>
            <CardHeader>
                Latest Trades
            </CardHeader>
            </Card>
        </div>


    </div>
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