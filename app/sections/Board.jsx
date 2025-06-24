'use client'
import Image from 'next/image'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper, useControls, useTransformContext } from 'react-zoom-pan-pinch'
import { GlobalContext } from '../context/Context'
import RenderFloor from '../components/RenderFloor'



function Board() {
    const { cursorActive, buildActive, handleClick, boardWrapperRef, walls, setIsPanning, combinedHandleMouseMove, floors } = useContext(GlobalContext)
    const boardRef = useRef()
    const [panningEnabled, setPanningEnabled] = useState(false)
    const panningTimerRef = useRef(null)


    function handleMouseDown() {
        panningTimerRef.current = setTimeout(() => {
            setPanningEnabled(true)
        }, 300)
    }

    function handleMouseUp() {
        clearTimeout(panningTimerRef.current)
        setPanningEnabled(false)
    }

    const BoardContent = () => {
        const transformState = useTransformContext()

        return (
            <TransformComponent contentStyle={{ width: '100%', height: '100dvh' }}>
                <div
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={(e) => combinedHandleMouseMove(e, transformState?.transformState)}
                    ref={boardWrapperRef}
                    className=' w-[1920px] h-[1080px]'
                    onClick={(e) => handleClick(e, transformState?.transformState)}
                >
                    <Image alt='board' src={'/Board.svg'} width={1920} height={1080} className=' scale-200 sm:scale-100 translate-y-32 sm:translate-y-0 object-cover' />
                    {
                        walls?.map((wall, index) => (
                            <div
                                key={index}
                                className='absolute bg-gray-300 z-40'
                                style={{
                                    willChange: 'transform',
                                    top: wall.top,
                                    left: wall.left,
                                    width: wall.width,
                                    height: wall.height,
                                    transform: `rotate(${wall.rotate}deg)`,
                                    transformOrigin: 'left center',
                                }}
                            >
                                <div className='measure text-sm font-semibold text-gray-800 absolute -top-6 left-1/2 -translate-x-1/2 '>
                                    {wall.meter == 0 ? null : `${wall.meter}m`}
                                </div>
                                <div className='measure text-sm font-semibold text-gray-800 absolute rotate-180 top-2 left-1/2 -translate-x-1/2 '>
                                    {wall.meter == 0 ? null : `${wall.meter}m`}
                                </div>
                            </div>
                        ))
                    }
                    {/* Render rounded corners between walls */}
                    {
                        walls?.map((wall, index) => (
                            <div
                                key={index}
                                className='w-2 h-2 rounded-[1px] bg-gray-300 z-50 absolute'
                                style={{
                                    top: wall.lastCLickY,
                                    left: wall.lastCLickX - 4,
                                    transform: `rotate(${wall.rotate}deg)`,
                                }}
                            >
                            </div>
                        ))
                    }
                    {/* floors */}
                    {
                        <RenderFloor />
                    }
                </div>
            </TransformComponent>
        )

    }

    

    function handlePanning() {
        document.body.style.cursor = 'grabbing'
        setIsPanning(true)
    }
    function handlePanningEnd() {
        setIsPanning(false)
        document.body.style.cursor = buildActive ? 'crosshair' : 'default'
    }
    useEffect(() => {
        document.body.style.cursor = buildActive ? 'crosshair' : 'default'
    }, [cursorActive, buildActive])


    const Controls = () => {
        const { zoomIn, zoomOut } = useControls()

        return (
            <div className='ZoomTools fixed bottom-6 sm:left-12 left-2 sm:px-4 bg-white z-50 sm:gap-6 gap-3 h-12 rounded-full flex justify-between items-center shadow-lg shadow-black/10' >
                <button onClick={() => zoomOut()} className='sm:p-2 p-4 cursor-pointer hover:bg-primary/10 rounded-full'><Image alt='plus' src={'/minus.png'} width={16} height={16} className='sm:w-4 w-3 ' /></button>
                <button onClick={() => zoomIn()} className='sm:p-2 p-4 cursor-pointer hover:bg-primary/10 rounded-full'><Image alt='plus' src={'/plus.png'} width={16} height={16} className='sm:w-4 w-3 ' /></button>
            </div>
        )
    }
    return (
        <main className='relative inset-0 w-full h-dvh overflow-hidden bg-white z-0 mt-24'>
            <TransformWrapper
                ref={boardRef}
                panning={{ disabled: !panningEnabled }}
                disablePadding
                onPanning={handlePanning}
                onPanningStop={handlePanningEnd}
                minScale={1}
            >
                <Controls />
                <BoardContent />
            </TransformWrapper>
        </main>
    )
}

export default Board