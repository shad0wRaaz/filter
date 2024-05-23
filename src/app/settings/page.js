"use client";
import Navbar from '@/components/NavBar'
import { EyeNoneIcon, EyeOpenIcon, Link2Icon } from '@radix-ui/react-icons'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import { useUser } from '@/contexts/UserContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { MY_API_URL } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { decryptData, encryptData } from '@/lib/encryption';
import { useMySession } from '@/contexts/SessionContext';

const Settings = () => {
    const { user, setUser } = useUser();
    const { session } = useMySession();
    const [seeAPIKey, setSeeAPIKey] = useState(false);
    const [seeSecretKey, setSeeSecretKey] = useState(false);
    const { toast } = useToast();

    //get settings data
    const { data, status } = useQuery({
        queryKey: ["settings"],
        queryFn: async() => {
            return await fetch(`${MY_API_URL}/settings?u=${user.username}`)
                .then(res => res.json())
                .then(res => {
                    setUser({ ...user, secretKey: decryptData(res.secretKey), apiKey: decryptData(res.apiKey)})
                }
                );
        },
        enabled: session.email != ""
    });

    const mutation = useMutation({
        mutationFn: async(newuser) => {

            let mutationResult = "";
            const bodyObject = {
                username: user.username,
                apiKey: encryptData(user.apiKey),
                secretKey: encryptData(user.secretKey),
            }
            
            if(newuser){
                mutationResult = await fetch(`${MY_API_URL}/settings`, {
                    method: 'POST',
                    body: JSON.stringify(bodyObject)
                }).then(res => res.json());
            }else{
                mutationResult = await fetch(`${MY_API_URL}/settings`, {
                    method: 'PATCH',
                    body: JSON.stringify(bodyObject)
                }).then(res => res.json());
            }
            console.log(mutationResult)

            if(mutationResult.message == "Settings has been updated." || mutationResult.message == "Settings has been saved."){
                toast({
                    title: "Saved",
                    description: mutationResult.message
                });
            }
            return mutationResult;
        }
    });
    
    const handleSave = () => {
        mutation.mutate(false);
        
    }

  return (
    <>
    <header>
        <Navbar/>
    </header>
    <main className="container pt-10 max-w-[60rem]">
        <div className="flex flex-wrap">
            <div className="p-4 flex gap-2 flex-col">
                <div className="flex items-center font-bold"><Link2Icon className="mr-2 h-4 w-4" /> TradeSync Connection</div>
                <div className="flex items-center"><CreditCard className="mr-2 h-4 w-4" /> Billing</div>

            </div>
            <div className="border-l p-4 pl-6">
                <Card>
                    <CardHeader>
                        <CardTitle>TradeSync Connection</CardTitle>
                        <CardDescription>Use your TradeSync API Key and Secret to connect to TradeSync account.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">API Key</Label>
                            <div className="flex items-center gap-2">
                                <Input id="apikey" 
                                    placeholder="Enter your API key here" 
                                    value={ user.apiKey } 
                                    onChange={(e) => setUser({ ...user, apiKey: e.target.value})}
                                    type={seeAPIKey ? "text" : "password"}/>
                                <div className="border rounded-sm p-3 cursor-pointer hover:bg-secondary" onClick={() => setSeeAPIKey(prev => !prev)}>
                                    {seeAPIKey ? <EyeOpenIcon/> : <EyeNoneIcon/> }
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Secret</Label>
                            <div className="flex items-center gap-2">
                                <Input 
                                    id="secretkey" 
                                    placeholder="Enter your API key here"
                                    value={ user.secretKey } 
                                    onChange={(e) => setUser({ ...user, secretKey: e.target.value})}
                                    type={seeSecretKey ? "type" : "password"}/>
                                <div className="border rounded-sm p-3 cursor-pointer hover:bg-secondary" onClick={() => setSeeSecretKey(prev => !prev)}>
                                    {seeSecretKey ? <EyeOpenIcon/> : <EyeNoneIcon/> }
                                </div>
                            </div>
                        </div>
                    </div>
                    </CardContent>
                    <CardFooter className="flex justify-start">
                        <Button onClick={() => handleSave()}>{ mutation.isPending ? "Saving..." : "Save"}</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </main>
    </>
  )
}

export default Settings