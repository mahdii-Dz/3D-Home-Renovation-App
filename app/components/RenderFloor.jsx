import React, { useContext } from 'react'
import { GlobalContext } from '../context/Context'

const RenderFloor = () => {
    const { floors } = useContext(GlobalContext)
    if (!floors || floors.length == 0) return
    return (
        <>
            {

                floors?.map((floor, index) => {
                    const points = floor.points;
                    if (!points || points.length === 0) return null;

                    // Build SVG path string
                    const pathString = points.reduce((acc, point, i) => {
                        const cmd = i === 0 ? 'M' : 'L';
                        return `${acc} ${cmd} ${point.x} ${point.y}`;
                    }, '') + ' Z';
                    return (
                        <svg
                            key={index}
                            width="1920"
                            height="1080"
                            viewBox="0 0 1920 1080"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 30,
                                pointerEvents: 'none'
                            }}
                        >
                            {/* Draw the filled shape */}
                            <path
                                d={pathString}
                                fill="#DEB887"
                            />
                        </svg>
                    )
                })
            }
        </>
    )
}

export default RenderFloor