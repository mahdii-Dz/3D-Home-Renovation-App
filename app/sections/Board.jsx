'use client'
import React, { useContext } from 'react'
import D2Board from './D2Board'
import { GlobalContext } from '../context/Context'
import D3Board from './D3Board'

function Board() {
    const { D2Active, D3Active, setD2Active, setD3Active } = useContext(GlobalContext)

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
            <div className='fixed bottom-4 left-1/2 -translate-1/2 px-4 py-1 bg-white shadow-lg rounded-full flex justify-center items-center gap-4 z-50'>
                <button onClick={handle2D} className={`p-4 hover:bg-primary/10 rounded-full border border-transparent cursor-pointer ${D2Active ? 'bg-primary/10 border !border-primary' : ''}`}>2D</button>
                <button onClick={handle3D} className={`p-4 hover:bg-primary/10 rounded-full border border-transparent cursor-pointer ${D3Active ? 'bg-primary/10 border !border-primary' : ''}`}>3D</button>
            </div>
            {
                D2Active
                    ? <D2Board />
                    : <D3Board />
            }
        </>
    )
}

export default Board