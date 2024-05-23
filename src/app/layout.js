import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { UserProvider } from "@/contexts/UserContext";
import { ReactQueryClientProvider } from "./Providers/ReactQueryClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { FilterProvider } from "@/contexts/FilterContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { cn } from "@/lib/utils";
import { CopyTradeProvider } from "@/contexts/CopyTradeContext";
import { LeadFollowerProvider } from "@/contexts/LeadFollowerContext";
import { AccountsProvider } from "@/contexts/AccountsContext";
import { DashboardTableProvider } from "@/contexts/DashboardTableContext";
import SessionWrapper from "./Providers/SessionWrapper";
import { MySessionProvider } from "@/contexts/SessionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Account Filter",
  description: "Account Filter",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-100 dark:bg-gray-800")}>
        <MySessionProvider>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            disableTransitionOnChange
            >
              <ReactQueryClientProvider>
                <FilterProvider>
                  <UserProvider>
                    <WatchlistProvider>
                      <AccountsProvider>
                        <DashboardTableProvider>
                          <LeadFollowerProvider>
                            <CopyTradeProvider>
                                {children}
                            </CopyTradeProvider>
                          </LeadFollowerProvider>
                        </DashboardTableProvider>
                      </AccountsProvider>
                    </WatchlistProvider>
                    <Toaster/>
                  </UserProvider>
                </FilterProvider>
              </ReactQueryClientProvider>
          </ThemeProvider>
        </MySessionProvider>
      </body>
    </html>
  );
}
