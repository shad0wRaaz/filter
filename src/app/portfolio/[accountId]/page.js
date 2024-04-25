import Navbar from '@/components/NavBar'
import PortfolioDialog from '@/components/PortfolioDialog/Portfolio'

const page = ({params}) => {
  return (
    <>
        <header>
            <Navbar/>
        </header>
        <main className="p-6">
          <PortfolioDialog accountId={params.accountId}/>
        </main>
    </>
  )
}

export default page