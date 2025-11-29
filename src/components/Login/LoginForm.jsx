"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { encryptData } from "@/lib/encryption";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import Link from "next/link";


const LoginForm = () => {
    const router = useRouter();
    console.log(encryptData("WW5capKYFbrL"));

    const submitHandler = async (e) => {
        e.preventDefault();

        const resdata = await signIn("credentials", {
          email: e.target.username.value,
          password: e.target.password.value,
          redirect: false,
        });
    
        if (
          resdata.status === 400 ||
          resdata.status === 401 ||
          resdata.status === 403
        ) {
            toast("Login Error", {
                description: "Invalid credentails. Please try again."
            });
        } else if (resdata.status === 500) {    
            toast("Server Error", {
                description: "Error login in server.    "
            });
        } else {
          router.push('/dashboard');
        }
      };
  return (
    <div className="w-full lg:grid lg:grid-cols-2 lg:min-h-screen xl:min-h-screen h-full">
        <div className="absolute">
        <Toaster/>
         </div>   
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto grid w-[350px] gap-6">
                <div className="grid gap-2 text-center">
                    <h1 className="text-3xl font-bold">Login</h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <form onSubmit={submitHandler} className="space-y-5">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="username"
                            type="email"
                            name="username"
                            placeholder="m@example.com"
                            required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot your password?
                            </Link>
                            </div>
                            <Input id="password" type="password" name="password" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                        {/* <Button variant="outline" className="w-full">
                            Login with Google
                        </Button> */}
                    </div>
                    {/* <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="#" className="underline">
                            Sign up
                        </Link>
                    </div> */}
                </form>
            </div>
        </div>
        <div className="hidden bg-muted lg:block relative h-full">
            <Image
                src="/how-to-open-a-forex-broker-account.jpg"
                alt="Image"
                fill={true}
                className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
            </div>
    </div>
    // <div className="min-h-screen flex items-center justify-center border bg-gradient-to-r from-cyan-500 to-blue-500">
    //     <Toaster/>
    //     <div className="max-w-5xl w-full min-h-[500px] overflow-hidden bg-white rounded-md shadow-md grid grid-cols-4">
    //         <div className="col-span-2 p-[80px]">
    //             <h2 className="text-2xl font-bold mb-8">Welcome back</h2>
    //             <form onSubmit={submitHandler} className="space-y-5">
    //                 <div className="mb-4">
    //                     <label
    //                     htmlFor="username"
    //                     className="block text-sm font-medium text-gray-600"
    //                     >
    //                     Username
    //                     </label>
    //                     <input
    //                     type="text"
    //                     id="username"
    //                     name="username"
    //                     className="mt-1 p-2 w-full border rounded-md"
    //                     />
    //                 </div>
    //                 <div className="mb-4">
    //                     <label
    //                     htmlFor="password"
    //                     className="block text-sm font-medium text-gray-600"
    //                     >
    //                     Password
    //                     </label>
    //                     <input
    //                     type="password"
    //                     id="password"
    //                     name="password"
    //                     className="mt-1 p-2 w-full border rounded-md"
    //                     />
    //                 </div>
    //                 <Button type="submit">Login</Button>
    //             </form>
    //         </div>
    //         <div className="col-span-2 w-full relative">
    //             <Image src="/loginbackground.png" priority={true} alt="Trade" fill={true} style={{ objectFit: "cover" }}/>
    //         </div>
    //     </div>
    // </div>
  )
}

export default LoginForm