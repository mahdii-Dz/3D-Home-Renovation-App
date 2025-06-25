import Image from 'next/image'
import React from 'react'
import Tools from '../components/Tools'

function Header() {
  return (
    <header className='w-full drop-shadow-xl fixed top-0 right-0 z-50 bg-white '>
        <div className='inline-block px-8 pt-4'>
            <Image alt='logo' src={'/Logo.png'} width={36} height={36} />
        </div>
        <hr className='text-gray-200' />
        <Tools/>
    </header>
  )
}

export default Header