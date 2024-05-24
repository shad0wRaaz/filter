"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";


const LoginForm = () => {
    const router = useRouter();
    const submitHandler = async (e) => {
        e.preventDefault();

        const resdata = await signIn("credentials", {
          email: e.target.username.value,
          password: e.target.password.value,
          redirect: false,
        });
    
        // console.log(resdata);
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
        //   console.log(resdata);
        }
      };
  return (
    <div className="min-h-screen flex items-center justify-center border bg-gradient-to-r from-cyan-500 to-blue-500">
        <Toaster/>
        <div className="max-w-5xl w-full min-h-[500px] overflow-hidden bg-white rounded-md shadow-md grid grid-cols-4">
            <div className="col-span-2 p-[80px]">
                <h2 className="text-2xl font-bold mb-8">Welcome back</h2>
                <form onSubmit={submitHandler} className="space-y-5">
                    <div className="mb-4">
                        <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-600"
                        >
                        Username
                        </label>
                        <input
                        type="text"
                        id="username"
                        name="username"
                        className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-600"
                        >
                        Password
                        </label>
                        <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 p-2 w-full border rounded-md"
                        />
                    </div>
                    <Button type="submit">Login</Button>
                </form>
            </div>
            <div className="col-span-2 w-full relative">
                <Image src="/loginbackground.png" alt="Trade" fill={true} style={{ objectFit: "cover" }}/>
            </div>
        </div>
    </div>
  )
}

export default LoginForm