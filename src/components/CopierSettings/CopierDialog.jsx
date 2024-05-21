"use client";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PencilIcon } from "../icons/CustomIcons"
import { Switch } from "../ui/switch"
import { useQueryClient } from '@tanstack/react-query'
import { useCopyTrade } from "@/contexts/CopyTradeContext"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEffect, useState } from "react"
import { useUser } from "@/contexts/UserContext";
import { MY_API_URL } from "@/lib/utils";
import { toast } from 'sonner';


const CopierDialog = ({ type }) => {
    const [open, setOpen] = useState(false);
    const {user} = useUser();
    const qc = useQueryClient();
    const { master, setMaster, slaves, setSlaves } = useCopyTrade();
    const [copierObject, setCopierObject] = useState({
        lead_id: '',
        follower_id: '',
        risk_type: 'risk_multiplier_by_balance',
        risk_value: 1,
    });
    // mode: "on",
    //     comment: '',
    //     copy_existing: "no",
    //     force_min: "no",
    //     slippage: 5,
    //     copy_pending: '',
    //     copy_sl: "no",
    //     copy_tp: "no",
    //     comment	: '',
useEffect(() => {
    if(!master) return;
    setCopierObject({ ...copierObject, lead_id: master.id});
}, [master, copierObject]);

const createCopier = (e) => {
    e.preventDefault();
    // console.log(master, slaves);
    if(!master || slaves.length == 0) return;
    const response = slaves.map(async(follower) => await fetch(`${MY_API_URL}/copyer`, {
        method: "POST",
        body: JSON.stringify({
            type: "create",
            ak: user.apiKey,
            sk: user.secretKey,
            copyObject: {...copierObject, follower_id: follower.id},
        })
        })
    );
    const newresponse = 
    Promise.all(response).then(data => {
        const slaveslist = slaves.map(acc => acc.client_name).join(', ')
        toast("Copier Created", { description: `${slaveslist} ${slaves.length > 1 ? "have" : "has"} been added as follower${slaves.length > 1 ? "s" : ""} to ${master.client_name}.`})
        setMaster('');
        setSlaves([]);
    });
    setOpen(false);
    qc.invalidateQueries(['copiers']);



}

  return (
    <Dialog className="" open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Badge className="rounded-[5px] border text-center shadow-sm border-slate-200 dark:bg-slate-600 dark:border-slate-700 bg-blue-500 cursor-pointer">
            Setup Copier
            </Badge>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] min-h-[650px] flex-start gap-4 flex items-start justify-start flex-col">
            <DialogHeader>
            <DialogTitle>Copier Settings</DialogTitle>
            <DialogDescription>
                Make changes to your Copier Settings. Click {type} when you are done.
            </DialogDescription>
            </DialogHeader>
            <div className="relative w-full">
                <Tabs defaultValue="mode" className="w-full mt-2">
                    <TabsList>
                        <TabsTrigger value="mode">Mode</TabsTrigger>
                        <TabsTrigger value="risk">Risk</TabsTrigger>
                        <TabsTrigger value="limits">Limits</TabsTrigger>
                        <TabsTrigger value="symbols">Symbols</TabsTrigger>
                        <TabsTrigger value="map">Map</TabsTrigger>
                    </TabsList>
                    <TabsContent value="mode" className="pt-3 flex gap-3 flex-col">
                        <div className="flex gap-2 flex-col flex-start">
                            <Label htmlFor="copyfrom">Lead Account : {master.client_name}</Label>
                        </div>
                        <div className="flex gap-2 flex-col flex-start mt-3 py-0.5">
                            <Label htmlFor="copyfrom">Follower Account{slaves.length > 1 && "s"} : </Label>
                            <div className="flex gap-2 flex-row">
                                {slaves.map(acc => (
                                    <Badge key={acc.id} className="rounded-[5px]" variant="secondary">
                                        {acc.client_name}
                                    </Badge>
                                )
                                )}
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="copiermode" className="text-right">Copier Mode</Label>
                                <ToggleGroup 
                                    className="justify-start mt-1"
                                    variant="outline"
                                    type="single" 
                                    value={copierObject.mode}
                                    onValueChange={(value) => {
                                        if (value) setCopierObject({...copierObject, mode: value});
                                    }}>
                                    <ToggleGroupItem value="on" aria-label="Toggle bold">
                                        On
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="monitor" aria-label="Toggle italic">
                                        Monitor
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="off" aria-label="Toggle underline">
                                        Off
                                    </ToggleGroupItem>
                                </ToggleGroup>
                        </div>

                        <div>
                            <Label htmlFor="comment" className="text-right">Comment</Label>
                            <Input 
                                id="comment" 
                                placeholder="Add copier comment here..." 
                                className="w-full mt-1"
                                value={copierObject.comment}
                                onChange={e => setCopierObject({...copierObject, comment: e.target.value})}/>
                        </div>

                    </TabsContent>
                    <TabsContent value="risk" className="pt-3 flex gap-3 flex-col">
                        <div className="flex gap-2 flex-col flex-start">
                            <Label htmlFor="risktype">Risk Type</Label>
                            <Select 
                                id="risktype" 
                                className=" mt-1"
                                value={copierObject.risk_type}
                                onValueChange={value => setCopierObject({ ...copierObject, risk_type: value})}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Risk Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="risk_multiplier_by_balance">Risk Multiplier by Balance</SelectItem>
                                    <SelectItem value="risk_multiplier_by_equity">Risk Multiplier by Equity</SelectItem>
                                    <SelectItem value="lot_multiplier">Lot Multiplier</SelectItem>
                                    <SelectItem value="fixed_lot">Fixed Lot</SelectItem>
                                    <SelectItem value="percentage_risk_per_trade_by_balance">Percentage Risk per Trade by Balance</SelectItem>
                                    <SelectItem value="percentage_risk_per_trade_by_equity">Percentage Risk per Trade by Equity</SelectItem>
                                    <SelectItem value="risk_amount_per_trade">Risk Amount per Trade</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="riskmultiplier" className="text-right">Risk Multiplier</Label>
                            <Input 
                                id="riskmultiplier" 
                                placeholder="1" 
                                className="w-full mt-1" 
                                type="number" 
                                value={copierObject.risk_value}
                                onChange={e => setCopierObject({...copierObject, risk_value: e.target.value})} />
                        </div>
                        <div>
                            <Label htmlFor="slippage" className="text-right">Slippage</Label>
                            <Input 
                                id="slippage" 
                                placeholder="100" 
                                className="w-full mt-1" 
                                type="number" 
                                value={copierObject.slippage}
                                onChange={e => setCopierObject({...copierObject, slippage: e.target.value})}/>
                        </div>
                        <div>
                            <Label htmlFor="maxlot" className="text-right">Max Lot</Label>
                            <Input 
                                id="maxlot" 
                                placeholder="50" 
                                className="w-full mt-1" 
                                type="number" 
                                value={copierObject.max_lot}
                                onChange={e => setCopierObject({...copierObject, max_lot: e.target.value})}/>
                        </div>
                        <div className="flex justify-between mt-3">
                            <Label htmlFor="forceminlot" className="text-right">Force Min Lot</Label>
                            <Switch 
                                id="forceminlot" 
                                checked={copierObject.force_min == "yes" ? true : false}
                                onCheckedChange={() => setCopierObject({ ...copierObject, force_min: copierObject.force_min == "yes" ? "no" : "yes"})}
                                />
                        </div>
                        <div className="flex justify-between mt-3">
                            <Label htmlFor="alternate" className="text-right">Use Alternative Tick Value</Label>
                            <Switch 
                                id="alternativetick" 
                                checked={copierObject.alternative_tick_value == "yes" ? true : false}
                                onCheckedChange={() => setCopierObject({ ...copierObject, alternative_tick_value: copierObject.alternative_tick_value == "yes" ? "no" : "yes"})}
                                />
                        </div>
                    </TabsContent>
                    <TabsContent value="limits" className="pt-3 flex gap-4 flex-col">
                        <div className="flex gap-2 flex-col flex-start">
                            <Label htmlFor="risktype">Copy Stop Loss</Label>
                            <Select 
                                id="copystoploss" 
                                className=" mt-1"
                                value={copierObject.copy_sl}
                                onValueChange={value => setCopierObject({ ...copierObject, copy_sl: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Stop Loss Copier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 flex-col flex-start">
                            <Label htmlFor="risktype">Copy Take Profit</Label>
                            <Select 
                                id="copytakeprofit" 
                                className=" mt-1"
                                value={copierObject.copy_tp}
                                onValueChange={value => setCopierObject({ ...copierObject, copy_tp: value })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Take Profit Copier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="no">No</SelectItem>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-between mt-3">
                            <Label htmlFor="copypending" className="text-right">Copy Pending Orders</Label>
                            <Switch 
                                id="copypending"
                                checked={copierObject.copy_pending == "yes" ? true : false}
                                onCheckedChange={() => setCopierObject({ ...copierObject, copy_pending: copierObject.copy_pending == "yes" ? "no" : "yes"})}/>
                        </div>
                    </TabsContent>
                    <TabsContent value="symbols">Symbols Settings</TabsContent>
                    <TabsContent value="map">Map Settings</TabsContent>
                </Tabs>
                <Button
                    className="absolute top-2 right-0 flex gap-1"
                    onClick={(e) => createCopier(e)}>
                    <PencilIcon/>
                    {type}
                </Button>
            </div>
            <DialogFooter className="flex justify-end">
                
            </DialogFooter>
        </DialogContent>
        </Dialog>
  )
}

export default CopierDialog