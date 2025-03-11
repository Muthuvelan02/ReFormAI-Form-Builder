"use client"
import { Button } from '@/components/ui/button'
import { SignIn, SignInButton } from '@clerk/clerk-react'
import { UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
  const { user, isSignedIn } = useUser();
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, [])
  return !path.includes('aiform') && (
    <div className='p-3 border-b drop-shadow-md sticky top-0 bg-white bg-opacity-45 backdrop-blur-md z-50'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Link href={'/'}>
            <Image src={'/logo.svg'} width={50} height={50} alt='logo' />
          </Link>
          <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text inline-block">
  ReForm
</h1>

        </div>
        {isSignedIn ? (
          <div className='flex items-center gap-5'>
            <Link href={'/dashboard'}>
              <Button variant="outline">Dashboard</Button>
            </Link>
            <UserButton />
          </div>
        ) : (
          <SignInButton>
           <Button className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105">
  Get Started
</Button>

          </SignInButton>
        )}
      </div>
    </div>
  )
}

export default Header
