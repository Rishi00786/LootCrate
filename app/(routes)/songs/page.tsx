"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Navbar from '@/components/ui2/Navbar'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [result, setResult] = useState(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSearchSong = async() => {
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`/api/songs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ searchQuery }),
        })
  
        if (response.ok) {
          const data = await response.json()
          setResult(data)
        } else {
          console.error('Failed to fetch search results')
        }
      } catch (error) {
        console.error('Error searching for song:', error)
      }
    }
  }

  return (
    <div className={cn(
      "bg-gradient-to-r w-[100vw] h-screen from-blue-500 to-purple-500 dark:from-black dark:to-gray-800"
    )}>
      <Navbar />
      <div className='w-[100vw] mt-12 flex flex-col gap-8 items-center justify-start'>
        <div className='text-5xl font-bold'>Search for Song</div>
        <div className='flex item-center justify-center gap-4'>
          <Input 
            className='w-[40vw] h-12' 
            type='text' 
            placeholder='e.g. Perfect by Ed Sheeran' 
            value={searchQuery} 
            onChange={handleInputChange}
          />
          <div className='flex items-center justify-center'>
            <Button onClick={handleSearchSong}>Search</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page 