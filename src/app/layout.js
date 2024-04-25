import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./Providers/ThemeProvider";
import { UserProvider } from "@/contexts/UserContext";
import { ReactQueryClientProvider } from "./Providers/ReactQueryClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { FilterProvider } from "@/contexts/FilterContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { cn } from "@/lib/utils";
import { AnalysisProvider } from "@/contexts/AnalysisContext";
import { CopyTradeProvider } from "@/contexts/CopyTradeContext";
import { LeadFollowerProvider } from "@/contexts/LeadFollowerContext";
import { AccountsProvider } from "@/contexts/AccountsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Account Filter",
  description: "Account Filter",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-gray-100 dark:bg-gray-800")}>
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
                    <AnalysisProvider>
                      <AccountsProvider>
                        <LeadFollowerProvider>
                          <CopyTradeProvider>
                              {children}
                          </CopyTradeProvider>
                        </LeadFollowerProvider>
                      </AccountsProvider>
                    </AnalysisProvider>
                  </WatchlistProvider>
                  <Toaster/>
                </UserProvider>
              </FilterProvider>
            </ReactQueryClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
