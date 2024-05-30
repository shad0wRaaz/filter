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
import { decryptData, encryptData } from '@/lib/encryption';
import { useSession } from 'next-auth/react';
import UnauthorizedAccess from '@/components/UnauthorizedAccess';
import { Toaster, toast } from 'sonner';

const Settings = () => {
    const { user, setUser } = useUser();
    const session = useSession();
    const [seeAPIKey, setSeeAPIKey] = useState(false);
    const [seeSecretKey, setSeeSecretKey] = useState(false);

    //get settings data
    const { data, status } = useQuery({
        queryKey: ["settings"],
        queryFn: async() => {
            return await fetch(`${MY_API_URL}/accounts/settings/get`,{
                method: "POST",
                body: JSON.stringify({email: session.data.data.email }),
                headers: {
                   "Content-Type": "application/json"
                }
              })
                .then(res => res.json())
                .then(res => {
                    setUser({ email: session.data.data.email, secretKey: decryptData(res.secretKey), apiKey: decryptData(res.apiKey)});
                    return res;
                }
                );
        },
        enabled: session.status == "authenticated"
    });

    const mutation = useMutation({
        mutationFn: async() => {

            let mutationResult = "";
            const bodyObject = {
                email: session.data.data.email,
                apiKey: encryptData(user.apiKey),
                secretKey: encryptData(user.secretKey),
            }

            mutationResult = await fetch(`${MY_API_URL}/accounts/settings/save`, {
                method: "POST",
                body: JSON.stringify(bodyObject),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json());

            if(!mutationResult.acknowledged){
                toast.error("Failed to update settings.");
            }
            else if(mutationResult.acknowledged && mutationResult.modifiedCount == 0){
                toast.info("No changes were made.");
            }else if(mutationResult.acknowledged && mutationResult.modifiedCount ==1){
                toast.success("Settings have been saved.");
            }
            return mutationResult;
        }
    });
    
    const handleSave = () => {

        if(user.apiKey == "" || user.secretKey == "" || !user.apiKey || !user.secretKey){
            toast.error("Please fill up both API and Secret keys.");
            return
        }
        mutation.mutate();
        
    }

  return (
    <>
        {session.status != "authenticated" ? <UnauthorizedAccess/> : (
            <>
                <header>
                    <Navbar/>
                </header>
                <Toaster/>
                <main className="container pt-10 max-w-[60rem]">
                    <div className="flex flex-wrap">
                        <div className="p-4 flex gap-2 flex-col">
                            <div className="flex items-center font-bold"><Link2Icon className="mr-2 h-4 w-4" /> TradeSync Connection</div>
                            <div className="flex items-center"><CreditCard className="mr-2 h-4 w-4" /> Billing</div>

                        </div>
                        <div className="border-l p-4 pl-6">
                            <Card className="min-w-[500px]">
                                <CardHeader>
                                    <CardTitle>TradeSync Connection</CardTitle>
                                    <CardDescription>Use your TradeSync API Key and Secret.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <Label htmlFor="name">API Key</Label>
                                        <div className="flex items-center gap-2">
                                            <Input id="apikey" 
                                                placeholder="Enter your API key here" 
                                                value={ user.apiKey || "" } 
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
                                                value={ user.secretKey || "" } 
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
        )}
    </>
  )
}

export default Settings