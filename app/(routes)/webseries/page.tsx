/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/ui2/Navbar';
// import Loader from '@/components/loader/loader'; // Import your Loader component
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface MovieResult {
    title: string;
    link: string
}

const page = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState<MovieResult[]>([]);


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSeries = async () => {
        if (searchQuery.trim()) {
            try {
                const response = await fetch(`/api/webseries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchQuery }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setResult(data.articles || []); // Update to use youtubeResults
                } else {
                    console.error('Failed to fetch search results');
                }
            } catch (error) {
                console.error('Error searching for song:', error);
            }
        }
    };

    const handleGetSeasons = async () => {
        
    }


    return (
        <div className={cn(
            "bg-gradient-to-r w-[100vw] min-h-screen from-blue-500 to-purple-500 dark:from-black dark:to-gray-800"
        )}>
            <Navbar />
            <div className={`w-[100vw] mt-12 flex flex-col gap-8 items-center justify-start`}>

                <>
                    <div className='text-5xl font-bold'>Search for WebSeries</div>
                    <div className='flex item-center justify-center gap-4'>
                        <Input
                            className='w-[40vw] h-12'
                            type='text'
                            placeholder='e.g. Money Heist'
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                        <div className='flex items-center justify-center'>
                            <Button onClick={handleSearchSeries}>Search</Button>
                        </div>
                    </div>
                    <div className='mt-8 flex flex-col gap-12 items-center justify-center'>
                        {result.map((item, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 p-4  rounded-lg shadow-md">
                                <div className="text-lg font-semibold">{item.title}</div>
                                <button
                                    onClick={handleGetSeasons}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Get Seasons
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            </div>
        </div>
    )
}

export default page
