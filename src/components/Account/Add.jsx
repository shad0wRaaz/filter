"use client";
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EyeNoneIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { MY_API_URL } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toaster, toast } from 'sonner'
import { useSession } from 'next-auth/react';

const style = {
    input: 'dark:bg-slate-600 dark:border-slate-500',
    button: 'dark:text-white'
}

const AddAccountComponent = () => {
    const session = useSession();
    const [selectedBroker, setSelectedBroker] = useState(null);
    const [selectedServer, setSelectedServer] = useState(null);
    const [serverList, setServerList] = useState(null);
    const [mtversion, setMtversion] = useState('4');
    const [showPassword, setShowPassword] = useState(false);
    const [cacheBrokersFour, setCacheBrokersFour] = useState();
    const [cacheBrokersFive, setCacheBrokersFive] = useState();

    const { data: brokers, isLoading: brokerLoading, status: brokerStatus } = useQuery({
        queryKey: ['brokers', mtversion],
        queryFn: async () => {
          return await fetch(
            `${MY_API_URL}/brokers/${session.data.data.email}/${mtversion}`)
            .then(res => res.json());
        },
        enabled: !cacheBrokersFour || !cacheBrokersFive || session.status == "authenticated"
      });

      useEffect(() => {
        if(!brokers) return;
            localStorage.setItem(`brokers_${mtversion}`, JSON.stringify(brokers));
        
            return() => {
                //do nothing
            }
      }, [brokers, mtversion])
      

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!selectedServer) { console.log("Server not selected."); return}

        const copyObject = {
            "account_name": e.target.accountname.value,
            "mt_version": mtversion,
            "account_number": e.target.accountId.value,
            "password": e.target.password.value,
            "broker_server_id": serverList?.filter(server => server.name == selectedServer)[0]?.id,
            "email": session.data.data.email
        }

        const response = await fetch(`${MY_API_URL}/accounts/client/save`, {
            method: "POST",
            body: JSON.stringify(copyObject),
            headers: {
                "Content-Type": "application/json",
            }
        });
        const result = await response.json();

        if(result.result == "success"){
            toast.success("Account Added", { description: `${e.target.accountname.value} has been added.`})
            clearData(e);
        }
    }
    const clearData = (e) => {
        e.target.accountname.value = "";
        e.target.accountId.value = "";
        e.target.password.value = "";
        setMtversion(4);
        setSelectedBroker(null);
        setSelectedServer(null);
    }

    const updateBrokerServerList = async(brokerNamewithArray) => {
        const brokerString = String(brokerNamewithArray).split(",");

        const brokerServers = await fetch(
            `${MY_API_URL}/brokers/servers/${session.data.data.email}/${brokerString[1]}`
        ).then(async res => {
            if(res.ok){
                return await res.json();
            }
        }).catch(err => console.log(err));

        setServerList(brokerServers);
    }

    return (
        <div className="max-w-lg m-auto py-6">
            <Toaster />
            <p className="p-6 pl-0 text-xl font-bold">Add Account</p>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <div className="flex gap-1 flex-col">
                        <Label>Account Name</Label>
                        <Input id="accountname" type="text" className={style.input}/>
                    </div>
                    <div className="flex gap-1 flex-col">
                        <Label>Trading Account Id</Label>
                        <Input id="accountId" type="text" className={style.input}/>
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
                        <Input id="password" type={showPassword ? 'text' : 'password'} className={style.input}/>
                    </div>
                    <div className="flex gap-2 flex-col">
                        <Label>Metatrader Version</Label>
                        <div className="rounded-md flex gap-3">
                            <div 
                                className={`px-3 py-1 cursor-pointer rounded-sm border transition ${mtversion == 4 ? "border-blue-500 bg-blue-100 dark:border-slate-400 dark:bg-slate-500" : "border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-400 dark:border-slate-500 dark:hover:text-slate-300"}`}
                                onClick={() => setMtversion(4)}>
                                    MT 4
                            </div>
                            <div 
                                className={`px-3 py-1 cursor-pointer rounded-sm border transition ${mtversion == 5 ? "border-blue-500 bg-blue-100 dark:border-slate-400 dark:bg-slate-500" : "border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-400 dark:border-slate-500 dark:hover:text-slate-300"}`}
                                onClick={() => setMtversion(5)}>
                                    MT 5
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-1 flex-col">
                        <Label>Broker</Label>
                        <Select onValueChange={(e) => updateBrokerServerList(e)}>
                            <SelectTrigger  className={style.input}>
                                <SelectValue placeholder="Select Broker" />
                            </SelectTrigger>
                            <SelectContent className={style.input}>
                                {brokers?.length > 0 && brokerStatus == "success" && brokers?.map(broker => (
                                    <SelectItem 
                                        key={broker.id} 
                                        value={(broker.name + "," + broker.id)}>
                                            {broker.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        {/* <BrokerCombo brokers={brokers} mtversion={mtversion}/> */}
                    </div>
                    <div className="flex gap-1 flex-col">
                        <Label>Broker Server</Label>
                        <Select onValueChange={(e) => setSelectedServer(e)} className={style.input}>
                            <SelectTrigger  className={style.input}>
                                <SelectValue placeholder="Select Server" />
                            </SelectTrigger>
                            <SelectContent className={style.input}>
                                {serverList?.length > 0 && serverList?.map(server => (
                                    <SelectItem 
                                        key={server.id} 
                                        value={server.name}>
                                            {server.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Button type="submit" className={style.button}>Add</Button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddAccountComponent