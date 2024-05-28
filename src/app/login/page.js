import LoginForm from "@/components/Login/LoginForm";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";


const Login = async() => {
    const session = await getServerSession(options);
    if(session) {
        redirect('/dashboard');
    }

  return (
      <LoginForm />
  )
}

export default Login