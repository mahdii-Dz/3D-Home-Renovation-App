'use client'
import React, { createContext, useEffect, useRef, useState } from 'react'

export const GlobalContext = createContext(null)
function Context({ children }) {
  // State management
  const [cursorActive, setCursorActive] = useState(true)
  const [buildActive, setBuildActive] = useState(false)
  const [walls, setWalls] = useState([])
  const [floors, setFloors] = useState([])
  const [isPanning, setIsPanning] = useState(false)
  const [startHelperWall, setStartHelperWall] = useState(false)
  const [shapeCoordinates, setShapeCoordinates] = useState([])
  const [pointsString, setPointsString] = useState('')
  const firstCLick = useRef(null)

  // Refs
  const boardWrapperRef = useRef(null)
  const lastCLickRef = useRef(null)
  const boxRef = useRef(null)
  const helperWallRef = useRef(null)

  // Reset last click if build mode is off
  if (!buildActive) lastCLickRef.current = null

  // Snap angles to the nearest 0/90/180/-90/etc.
  function snapAngle(angle, threshold = 10) {
    const angles = [0, 90, 180, -90, -180, 270, -270]
    for (let target of angles) {
      if (Math.abs(angle - target) < threshold) {
        return target
      }
    }
    return angle
  }

  // Handle board click to create wall
  function handleClick(e, transformState) {
    e.preventDefault()
    if (!buildActive || !boardWrapperRef.current || isPanning) return

    const rect = boardWrapperRef.current.getBoundingClientRect()
    const { scale } = transformState
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    if (!lastCLickRef.current) {
      firstCLick.current = { x, y }
      lastCLickRef.current = { x, y }
      setShapeCoordinates((prev) => {
        const newCoordinates = [...prev, lastCLickRef.current];
        setPointsString(newCoordinates.map(coord => `${coord.x},${coord.y}`).join(' '));
        return newCoordinates;
      })
      setStartHelperWall(true)
      return
    } else {
      let snapPoint = null
      const snapThreshold = 30
      const pointsToCheck = []
      // Gather all wall endpoints for snapping
      for (const wall of walls) {
        const start = { x: wall.left, y: wall.top }
        const end = {
          x: wall.left + Math.cos(wall.rotate * (Math.PI / 180)) * wall.width,
          y: wall.top + Math.sin(wall.rotate * (Math.PI / 180)) * wall.width,
        }
        pointsToCheck.push(start, end)
      }
      // Try to find the closest point to snap to
      for (const point of pointsToCheck) {
        const dist = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2)
        if (dist < snapThreshold) {
          snapPoint = point
          break
        }
      }

      const { x: prevX, y: prevY } = lastCLickRef.current
      const finalX = snapPoint ? snapPoint.x : x
      const finalY = snapPoint ? snapPoint.y : y
      const deltaX = finalX - prevX
      const deltaY = finalY - prevY
      const width = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const meter = (width / 100).toFixed(2)
      const rotateDeg = snapAngle(Math.atan2(deltaY, deltaX) * (180 / Math.PI))
      if (meter < 0.25) return
      lastCLickRef.current = {
        x: prevX + Math.cos(rotateDeg * (Math.PI / 180)) * width,
        y: prevY + Math.sin(rotateDeg * (Math.PI / 180)) * width,
      }
      setShapeCoordinates((prev) => {
        const newCoordinates = [...prev, lastCLickRef.current];
        setPointsString(newCoordinates.map(coord => `${coord.x},${coord.y}`).join(' '));
        return newCoordinates;
      })
      const newWall = {
        top: prevY,
        left: prevX,
        width: width,
        height: 8,
        rotate: rotateDeg,
        meter,
        lastCLickX: lastCLickRef.current.x,
        lastCLickY: lastCLickRef.current.y,
      }
      setWalls((prev) => [...prev, newWall])
      setStartHelperWall(false)
      // Clean up helper wall
      if (helperWallRef.current) {
        boardWrapperRef.current?.removeChild(helperWallRef.current)
        helperWallRef.current = null
      }
      if (shapeCoordinates.length >= 3) {
        setFloors(prev => [...prev, {
          id: Date.now(),
          top:firstCLick.current.y,
          left:firstCLick.current.x,
          points: shapeCoordinates,
          pointsString: shapeCoordinates.map(coord => `${coord.x},${coord.y}`).join(' '),
        }]);
      }
    }
  }

  // Mount visual cursor and helper wall
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
    // Create helper wall with labels
    if (lastCLickRef.current && !helperWallRef.current) {
      const el = document.createElement('div')
      el.classList.add('helperWall')
      el.style.height = '8px'
      el.style.transformOrigin = 'left center'
      el.style.pointerEvents = 'none'
      el.style.display = cursorActive ? 'none' : 'block'

      const TopMeasure = document.createElement('div')
      TopMeasure.classList.add('TopMeasure')
      const BottomMeasure = document.createElement('div')
      BottomMeasure.classList.add('BottomMeasure')
      el.appendChild(TopMeasure)
      el.appendChild(BottomMeasure)
      helperWallRef.current = el
      boardWrapperRef.current.appendChild(el)
    }

    // Reset helperWallRef when cursor is re-activated
    if (cursorActive) {
      helperWallRef.current = null
    }

    // Cleanup on unmount
    return () => {
      if (boxRef.current && document.body.contains(boxRef.current)) {
        document.body.removeChild(boxRef.current)
      }
      if (helperWallRef.current && boardWrapperRef.current?.contains(helperWallRef.current)) {
        boardWrapperRef.current.removeChild(helperWallRef.current);
        helperWallRef.current = null
      }
    }
  }, [cursorActive, startHelperWall, walls])
  useEffect(() => {
    if (!cursorActive) {
      setShapeCoordinates([])
      setPointsString('')
    }
  }, [cursorActive])

  // Handle red square movement with cursor
  function HandleBoxMove(e) {
    const WindowWidth = window.innerWidth
    if (!buildActive || WindowWidth < 786) return
    e.preventDefault()
    const x = e.clientX
    const y = e.clientY
    boxRef.current.style.left = `${x}px`
    boxRef.current.style.top = `${y}px`
  }

  // Render the dynamic helper wall during movement
  function HandleMouseMove(e, transformState) {
    const WindowWidth = window.innerWidth
    if (!buildActive || !boardWrapperRef.current || isPanning || !lastCLickRef.current || WindowWidth < 786) return
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

    requestAnimationFrame(() => {
      if (helperWallRef.current) {
        helperWallRef.current.style.left = `${prevX}px`
        helperWallRef.current.style.top = `${prevY}px`
        helperWallRef.current.style.width = `${width}px`
        helperWallRef.current.style.transformOrigin = 'left center'
        helperWallRef.current.style.transform = `rotate(${rotateDeg}deg)`
        if (helperWallRef.current.children.length >= 2) {
          helperWallRef.current.children[0].textContent = `${meter}m`
          helperWallRef.current.children[1].textContent = `${meter}m`
        }
      }
    })
  }


  // Combine mouse move logic for drawing and box rendering
  function combinedHandleMouseMove(e, transformState) {
    HandleMouseMove(e, transformState)
    HandleBoxMove(e)
  }

  return (
    <GlobalContext.Provider
      value={{
        cursorActive,
        buildActive,
        setCursorActive,
        setBuildActive,
        handleClick,
        boardWrapperRef,
        walls,
        setIsPanning,
        combinedHandleMouseMove,
        floors
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default Context