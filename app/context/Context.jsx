'use client'
import React, { createContext, useRef, useState } from 'react'

export const GlobalContext = createContext(null)
function Context({ children }) {
  const [cursorActive, setCursorActive] = useState(true)
  const [buildActive, setBuildActive] = useState(false)
  const [walls, setWalls] = useState([])
  const [isPanning, setIsPanning] = useState(false)
  const boardWrapperRef = useRef(null)
  const lastCLickRef = useRef(null)


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

    const rect = document.body.getBoundingClientRect()
    const { scale, positionX, positionY } = transformState
    const x = (e.clientX - rect.left - positionX) / scale
    const y = (e.clientY - rect.top - positionY) / scale

    if (!lastCLickRef.current) {
      lastCLickRef.current = { x, y }
    } else {
      const { x: prevX, y: prevY } = lastCLickRef.current
      const deltaX = x - prevX
      const deltaY = y - prevY
      const width = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const meter = (width / 100).toFixed(2)
      const newWall = {
        top: prevY,
        left: prevX,
        width: width,
        height: 8,
        rotate: 0,
        meter
      }
      const rotateDeg = snapAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI))
      newWall.rotate = rotateDeg

      setWalls(prev => [...prev, newWall])
      lastCLickRef.current = { x, y }
    }
  }
  console.log(walls);


  return (
    <GlobalContext.Provider value={{ cursorActive, buildActive, setCursorActive, setBuildActive, handleClick, boardWrapperRef, walls, setIsPanning }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default Context