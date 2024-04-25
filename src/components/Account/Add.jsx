"use client";
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { MY_API_URL } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '../ui/skeleton';

const AddAccountComponent = () => {
    const {user} = useUser();
    const [accountName, setAccountName] = useState('');
    const [accountID, setAccountID] = useState('');
    const [password, setPassword] = useState('');
    const [selectedBroker, setSelectedBroker] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);
    const [mtversion, setMtversion] = useState('4');
    const [showPassword, setShowPassword] = useState(true);

    const { data: brokers, isLoading: brokerLoading, status: brokerStatus } = useQuery({
        queryKey: ['brokers'],
        queryFn: async () => {
          return await fetch(
            `${MY_API_URL}/brokers`, {
                method: "POST",
                body: JSON.stringify({
                    ak: user.apiKey,
                    sk: user.secretKey
                })
            }).then(res => res.json());
        },
        enabled: user.secretKey != '' && user.apiKey != '' && localStorage.getItem("brokers") != null
      });
      
      useEffect(() => {
        if(!brokers) return;
        localStorage.setItem("brokers", JSON.stringify(brokers));
      }, [brokers])
      
      console.log(brokers);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(e.target.accountname.value);
    }

    return (
        <div className="max-w-lg m-auto py-6">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <div className="flex gap-1 flex-col">
                        <Label>Account Name</Label>
                        <Input id="accountname" type="text"/>
                    </div>
                    <div className="flex gap-1 flex-col">
                        <Label>Trading Account Id</Label>
                        <Input id="accountId" type="text"/>
                    </div>
                    <div className="flex gap-1 flex-col">
                        <div className="flex justify-between">
                            <Label>Trading Account Password</Label>
                            <div 
                                className="mr-2 cursor-pointer" 
                                onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <EyeOpenIcon/> :<EyeNoneIcon/>}
                            </div>
                        </div>
                        <Input id="password" type={showPassword ? 'text' : 'password'}/>
                    </div>
                    <div className="flex gap-2 flex-col">
                        <Label>Metatrader Version</Label>
                        <div className="rounded-md flex gap-3">
                            <div 
                                className={`px-3 py-1 cursor-pointer rounded-sm border transition ${mtversion == 4 ? "border-blue-500 bg-blue-100" : "border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-400"}`}
                                onClick={() => setMtversion(4)}>
                                    MT 4
                            </div>
                            <div 
                                className={`px-3 py-1 cursor-pointer rounded-sm border transition ${mtversion == 5 ? "border-blue-500 bg-blue-100" : "border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-400"}`}
                                onClick={() => setMtversion(5)}>
                                    MT 5
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1 flex-col">
                        <Label>Broker</Label>
                        {brokerLoading ? <Skeleton className="w-full h-5"/> : 
                            <Select>
                                <SelectTrigger className="">
                                    <SelectValue placeholder="Select Broker" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brokers && brokers.data.map(broker => (
                                        <SelectItem value="light">{broker.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        }
                    </div>
                    <div className="flex gap-1 flex-col">
                        <Label>Broker Server</Label>
                        <Input id="accountId" type="text"/>
                    </div>
                    <div>
                        <Button type="submit">Add</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddAccountComponent