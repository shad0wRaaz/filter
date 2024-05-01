import React from 'react'

const Loader = () => {
  return (
    <div className="flex justify-center">
        <div className="w-10 h-10">
            <svg viewBox="0 0 100 100">
                <defs>
                <filter id="shadow">
                    <feDropShadow dx="0" dy="0" stdDeviation="1.5" 
                    flood-color="#fc6767"/>
                </filter>
                </defs>
                <circle id="spinner" style={{fill:"transparent", stroke:"#dd2476", strokeWidth: "7px", strokeLinecap: "round"}} cx="50" cy="50" r="45" height="20px" weight="20px"/>
            </svg>
        </div>
    </div>
  )
}

export default Loader