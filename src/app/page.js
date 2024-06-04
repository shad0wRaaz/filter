// "use client"
// import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Home() {
  redirect('/login');
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2 className={`mb-3 text-2xl font-semibold`}>
        Account Filter
      </h2>
      {/* <Button onClick={() => router.push("/login")}>Login</Button> */}
    </main>
  );
}
