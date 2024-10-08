/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';

const Page = () => {

    const { searchQuery, setSearchQuery,
        setResult,
        setSeasons,
        setEpisodes
    } = useStateContext()

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const router = useRouter()

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
                    setResult(data.articles || []);
                    setSeasons([]);
                    setEpisodes([]);
                    router.push('/webseries/articles')
                } else {
                    console.error('Failed to fetch search results');
                }
            } catch (error) {
                console.error('Error searching for series:', error);
            }
        }
    };

    return (
        <div className={`w-[100vw] mt-12 flex flex-col gap-8 items-center justify-start`}>
            <div className='text-5xl font-bold'>Search for WebSeries</div>
            <div className='flex items-center justify-center gap-4'>
                <Input
                    className='w-[40vw] h-12'
                    type='text'
                    placeholder='e.g. Money Heist'
                    value={searchQuery}
                    onChange={handleInputChange}
                />
                <Button onClick={handleSearchSeries}>Search</Button>
            </div>
        </div>
    );
};

export default Page;