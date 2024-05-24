"use client";
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useMySession } from '@/contexts/SessionContext';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';


export default function SignIn() {
  const form = useForm();
  const { session, setSession } = useMySession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(e.target.username.value == process.env.NEXT_PUBLIC_TEST_USERNAME && e.target.password.value == process.env.NEXT_PUBLIC_TEST_PASSWORD) {
      setSession({username: e.target.username.value, email: e.target.username.value});
      router.replace('/dashboard');
    }else{
      toast("Login Error", {
        description: "Incorrect Username or Password",
      })
    }
    // if(e.target.username )

  };

  return (
    <div className="flex items-center justify-center h-[100%] w-full">
      <Toaster/>
      <div className="w-[400px] mt-[200px] rounded-md border shadow-md p-6 bg-white">
        <h2 className="text-center my-4 text-xl font-bold">Sign In</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}