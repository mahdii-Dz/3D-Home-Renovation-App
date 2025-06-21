'use client'
import React, { createContext, useEffect, useRef, useState } from 'react'

export const GlobalContext = createContext(null)
function Context({ children }) {
  const [cursorActive, setCursorActive] = useState(true)
  const [buildActive, setBuildActive] = useState(false)
  const [walls, setWalls] = useState([])
  const [helperWall, setHelperWall] = useState([])
  const [isPanning, setIsPanning] = useState(false)
  const [startHelperWall, setStartHelperWall] = useState(false)
  const boardWrapperRef = useRef(null)
  const lastCLickRef = useRef(null)
  const boxRef = useRef(null)
  const helperWallRef = useRef(null)

  if (!buildActive) lastCLickRef.current = null

  //this help the wall drawing be more accurate
  function snapAngle(angle, threshold = 10) {
    const angles = [0, 90, 180, -90, -180, 270, -270]
    for (let target of angles) {
      if (Math.abs(angle - target) < threshold) {
        return target
      }
    }
    return angle
  }

  //this create a wall on 2D plane
  function handleClick(e, transformState) {
    e.preventDefault()
    if (!buildActive || !boardWrapperRef.current || isPanning) return

    const rect = boardWrapperRef.current.getBoundingClientRect()
    const { scale } = transformState
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    if (!lastCLickRef.current) {
      lastCLickRef.current = { x, y }
      setStartHelperWall(true)
    } else {
      const { x: prevX, y: prevY } = lastCLickRef.current
      const deltaX = x - prevX
      const deltaY = y - prevY
      const width = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const meter = (width / 100).toFixed(2)
      const rotateDeg = snapAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI))
      if (meter < 0.25) return
      const newWall = {
        top: prevY,
        left: prevX,
        width: width,
        height: 8,
        rotate: rotateDeg,
        meter
      }
      setStartHelperWall(false)
      setWalls(prev => [...prev, newWall])
      lastCLickRef.current = { x, y }
    }
  }

  useEffect(() => {
    boxRef.current = document.createElement('div')
    boxRef.current.style.display = cursorActive ? 'none' : 'block'
    boxRef.current.style.position = 'absolute'
    boxRef.current.style.width = '8px'
    boxRef.current.style.height = '8px'
    boxRef.current.style.backgroundColor = 'red'
    boxRef.current.style.pointerEvents = 'none'
    boxRef.current.style.transform = 'translate(-50%, -50%)'
    document.body.appendChild(boxRef.current)
    if (startHelperWall && lastCLickRef.current) {
      const { x: prevX, y: prevY } = lastCLickRef.current
      helperWallRef.current = document.createElement('div')
      setHelperWall([{
        top: prevY,
        left: prevX,
        width: 0,
        height: 8,
        rotate: 0,
        meter: 0
      }])
    }
    if (helperWallRef.current) {
      helperWallRef.current.style.display = cursorActive ? 'none' : 'block'
    }
    if (cursorActive) {
      setHelperWall([]) // Clear helper wall if cursor is active
    }

    return () => {
      if (boxRef.current && document.body.contains(boxRef.current)) {
        document.body.removeChild(boxRef.current)
      }
      if (helperWallRef.current && boardWrapperRef.current?.contains(helperWallRef.current)) {
        boardWrapperRef.current.removeChild(helperWallRef.current);
      }
    }
  }, [cursorActive])

  function HandleBoxMove(e) {
    const WindowWidth = window.innerWidth
    if (!buildActive || WindowWidth < 1024) return
    e.preventDefault()
    const x = e.clientX
    const y = e.clientY
    boxRef.current.style.left = `${x}px`
    boxRef.current.style.top = `${y}px`
  }

  function HandleMouseMove(e, transformState) {
    const WindowWidth = window.innerWidth
    if (!buildActive || !boardWrapperRef.current || isPanning || !lastCLickRef.current || WindowWidth < 1024) return
    e.preventDefault()

    const rect = boardWrapperRef.current.getBoundingClientRect()
    const { scale } = transformState
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    const { x: prevX, y: prevY } = lastCLickRef.current
    const deltaX = x - prevX
    const deltaY = y - prevY
    const width = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const meter = (width / 100).toFixed(2)
    const rotateDeg = snapAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI))
    if (meter < 0.25) return

    setHelperWall([{
      top: prevY,
      left: prevX,
      width: width,
      height: 8,
      rotate: rotateDeg,
      meter: meter
    }])


  }

  function combinedHandleMouseMove(e, transformState) {
    HandleMouseMove(e, transformState)
    HandleBoxMove(e)
  }

  return (
    <GlobalContext.Provider value={{ cursorActive, buildActive, setCursorActive, setBuildActive, handleClick, boardWrapperRef, walls, setIsPanning, combinedHandleMouseMove, helperWall }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default Context