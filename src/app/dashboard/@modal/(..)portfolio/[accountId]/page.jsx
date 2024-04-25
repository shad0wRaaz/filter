"use client";
import PortfolioDialog from "@/components/PortfolioDialog/Portfolio";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const PortfolioInterceptor = ({params}) => {
  const router = useRouter();
  const handleDismiss = () => {
    router.back();
  }
  return (
    <Dialog
      open
      onOpenChange={isOpen => {if(!isOpen) { handleDismiss(); }}}>
      <DialogContent className="min-w-[90%] min-h-[90%]">
            <PortfolioDialog accountId={params.accountId}/>
      </DialogContent>
    </Dialog>

  )
}

export default PortfolioInterceptor