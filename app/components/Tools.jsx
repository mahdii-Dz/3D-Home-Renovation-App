'use client'
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import { GlobalContext } from '../context/Context'


function Tools() {
    const { cursorActive, buildActive, setBuildActive, setCursorActive, helperWallRef, lastCLickRef, setWalls, setFloors, setShapeCoordinates } = useContext(GlobalContext)

    function handleCursor() {
        if (cursorActive) {
            return
        }
        setCursorActive(prev => !prev)
        setBuildActive(prev => !prev)
    }
    function handleBuild() {
        if (buildActive) {
            return
        }
        setBuildActive(prev => !prev)
        setCursorActive(prev => !prev)
    }

    function handleCLick() {
        setShapeCoordinates([])
        setWalls([])
        setFloors([])
        lastCLickRef.current = null
        helperWallRef.current = null
    }

    return (
        <nav className='w-full flex justify-between items-center px-8'>
            <div className='Tools flex gap-6 py-2'>
                <div onClick={handleCursor} className={`w-10 h-10 border border-gray-200 rounded-xl flex justify-center items-center hover:bg-primary/10 hover:border-primary cursor-pointer ${cursorActive ? 'bg-primary/10 border-primary' : ''}`}>
                    <Image alt='Cursor' src={'/Cursor.png'} width={24} height={24} />
                </div>
                <div onClick={handleBuild} className={`w-10 h-10 border border-gray-200 rounded-xl flex justify-center items-center hover:bg-primary/10 hover:border-primary cursor-pointer ${buildActive ? 'bg-primary/10 border-primary' : ''}`}>
                    <Image alt='Cursor' src={'/Build.svg'} width={24} height={24} />
                </div>
            </div>
            <div>
                <button onClick={handleCLick} className='px-4 py-1.5 bg-primary cursor-pointer hover:bg-primary-dark active:bg-primary/80 text-white font-semibold rounded-lg'>Reset</button>
            </div>
        </nav>
    )
}

export default Tools