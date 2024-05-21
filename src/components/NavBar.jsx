
import Link from "next/link"
import { ModeToggle } from "./ThemeToggler";
import { DropdownMenuDemo } from "./ProfileMenu";
import { AvatarIcon, DashboardIcon } from "@radix-ui/react-icons";

const Navbar = () => {
    return (
      <nav className="flex items-center justify-between flex-wrap border p-5 shadow-sm rounded-md mt-2 bg-blue-500 mx-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          {/* <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z"/></svg> */}
          <Link href="/dashboard">
            <span className="font-semibold text-xl tracking-tight">Account Filter</span>
          </Link>
        </div>
        <div className="block lg:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
          </button>
        </div>
        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <Link href="/dashboard" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
              <div className="flex gap-1 items-center">
                <DashboardIcon/>  Dashboard
              </div>
            </Link>
            <Link href="/myaccounts" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white mr-4">
              <div className="flex gap-1 items-center">
                <AvatarIcon/> My Accounts
              </div>
            </Link>
          </div>
          <div className="flex gap-4">
            <ModeToggle/>
            <DropdownMenuDemo/>
          </div>
        </div>
      </nav>
      
    )
}

export default Navbar;