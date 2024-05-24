import React from 'react'
import Loader from './Loader';

const UnauthorizedAccess = () => {
  return (
    <div className="h-full w-full flex justify-center items-center">
        <div className="mt-[200px] flex justify-center flex-col">
            {/* <h2 className="mb-3 text-2xl font-bold">Authenticating</h2> */}
            <Loader/>
        </div>
    </div>
  )
}

export default UnauthorizedAccess