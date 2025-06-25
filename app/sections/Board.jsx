'use client'
import React, { useContext } from 'react'
import dynamic from 'next/dynamic'

import { GlobalContext } from '../context/Context'
const D2Board = dynamic(() => import('./D2Board'))
const D3Board = dynamic(() => import('./D3Board'))


function Board() {
    const { D2Active, D3Active, setD2Active, setD3Active, walls } = useContext(GlobalContext)

    const handle2D = () => {
        if (D2Active) return
        setD2Active(!D2Active)
        setD3Active(!D3Active)
    }
    const handle3D = () => {
        if (D3Active) return
        setD2Active(!D2Active)
        setD3Active(!D3Active)
    }

    return (
        <>
            <div className='fixed bottom-0 left-1/2 -translate-1/2 px-4 py-1.5 bg-white shadow-lg rounded-full flex justify-center items-center gap-4 z-50'>
                <button onClick={handle2D} className={`py-2 px-2.5 hover:bg-primary/10 rounded-full border border-transparent cursor-pointer ${D2Active ? 'bg-primary/10 border !border-primary' : ''}`}>2D</button>
                <button onClick={handle3D} className={`py-2 px-2.5 hover:bg-primary/10 rounded-full border border-transparent cursor-pointer ${D3Active ? 'bg-primary/10 border !border-primary' : ''}`}>3D</button>
            </div>
            {
                D2Active
                    ? <D2Board />
                    : walls.length > 0 && <D3Board />
            }
        </>
    )
}

export default Board