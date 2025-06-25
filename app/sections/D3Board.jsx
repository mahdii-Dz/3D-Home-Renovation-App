'use client'
import React, { Suspense, useContext, useMemo } from 'react'
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { GlobalContext } from '../context/Context'
import CanvasLoader from '../components/CanvasLoader'

// Get wall end point from rotation and width
const getWallEnd = (wall) => {
  const angleRad = THREE.MathUtils.degToRad(wall.rotate)
  return {
    x: wall.left + Math.cos(angleRad) * wall.width,
    y: wall.top + Math.sin(angleRad) * wall.width,
  }
}

// Wall component
function WallMesh({ wall, offsetX, offsetY }) {
  const wallHeight = 1
  const wallThickness = 0.1
  const angleRad = THREE.MathUtils.degToRad(wall.rotate)
  const end = getWallEnd(wall)


  // Offset and scale to meters
  const x1 = (wall.left - offsetX) / 100
  const z1 = (wall.top - offsetY) / 100
  const x2 = (end.x - offsetX) / 100
  const z2 = (end.y - offsetY) / 100

  const centerX = (x1 + x2) / 2
  const centerZ = (z1 + z2) / 2
  const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2)

  return (
    <mesh
      position={[centerX, wallHeight / 2, centerZ]}
      rotation={[0, -angleRad, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, wallHeight, wallThickness]} />
      <meshStandardMaterial color="#f0f0f0" />
    </mesh>
  )
}

// Floor that auto-sizes to fit walls
function RoomFloor({ bounds }) {
  const texture = useLoader(THREE.TextureLoader, '/floor.jpg')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 4)

  return (
    <mesh position={[0, 0, 0]} receiveShadow>
      <boxGeometry args={[bounds.width, 0.1, bounds.depth]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  )
}

function D3Board() {
  const { walls } = useContext(GlobalContext)

  // Compute bounding box of all walls to center everything
  const bounds = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    for (let wall of walls) {
      const end = getWallEnd(wall)
      minX = Math.min(minX, wall.left, end.x)
      maxX = Math.max(maxX, wall.left, end.x)
      minY = Math.min(minY, wall.top, end.y)
      maxY = Math.max(maxY, wall.top, end.y)
    }

    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    return {
      offsetX: centerX,
      offsetY: centerY,
      width: (maxX - minX) / 100 + 1, // +1 adds padding
      depth: (maxY - minY) / 100 + 1,
      centerVec3: [0, 0, 0],
    }
  }, [walls])

  return (
    <Canvas
      shadows
      style={{ width: '100%', height: '100vh', background: '#ffffff', marginTop: '100px' }}
    >
      <Suspense fallback={<CanvasLoader/>}>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 10, 10]} fov={50} />
        <OrbitControls target={bounds.centerVec3} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          castShadow
          position={[10, 20, 10]}
          intensity={1.5}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <hemisphereLight intensity={0.4} />

        {/* Floor and walls */}
        <RoomFloor bounds={bounds} />
        {walls.map((wall, index) => (
          <WallMesh key={index} wall={wall} offsetX={bounds.offsetX} offsetY={bounds.offsetY} />
        ))}
      </Suspense>
    </Canvas>
  )
}

export default D3Board
