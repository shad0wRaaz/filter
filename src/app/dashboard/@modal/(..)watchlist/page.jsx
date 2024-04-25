"use client";
import WatchlistDialog from "@/components/WatchlistDialog/Watchlist";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAccounts } from "@/contexts/AccountsContext";
import { useUser } from "@/contexts/UserContext";
import { useWatchlist } from "@/contexts/WatchlistContext";
import { useRouter } from "next/navigation";

const WatchlistInterceptor = () => {
  const router = useRouter();
  const { user } = useUser();
  const { allAccounts } = useAccounts();
  const { watchlist } = useWatchlist();
  console.log(user, allAccounts, watchlist);

  const handleDismiss = () => {
    router.back();
  }
  return (
    <Dialog
      open
      onOpenChange={isOpen => {if(!isOpen) { handleDismiss(); }}}>
      <DialogContent className="min-w-[90%] min-h-[90%]">
            <WatchlistDialog user={user} allAccounts={allAccounts} watchlist={watchlist} />
      </DialogContent>
    </Dialog>

  )
}

export default WatchlistInterceptor