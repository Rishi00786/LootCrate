/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';
import Loader from '@/components/loader/loader'; // Assuming you have a Loader component

const Page = () => {
    const { searchQuerySeries, setSearchQuerySeries, setResult, setSeasons, setEpisodes } = useStateContext();
    const [loading, setLoading] = useState(false); // State to track loading

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuerySeries(event.target.value);
    };

    const router = useRouter();

    const handleSearchSeries = async () => {
        if (searchQuerySeries.trim()) {
            setLoading(true); // Start loading
            try {
                const response = await fetch(`/api/webseries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchQuerySeries }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setResult(data.articles || []);
                    setSeasons([]);
                    setEpisodes([]);
                    router.push('/webseries/articles');
                } else {
                    console.error('Failed to fetch search results');
                }
            } catch (error) {
                console.error('Error searching for series:', error);
            } finally {
                setLoading(false); // Stop loading
            }
        }
    };

    return (
        <div className={`w-[100vw] mt-12 flex flex-col gap-8 items-center justify-start`}>
            <div className='text-5xl font-bold sub-heading-font'>Search for WebSeries</div>
            <div className='flex items-center justify-center gap-4'>
                <Input
                    className='w-[40vw] h-12'
                    type='text'
                    placeholder='e.g. Money Heist'
                    value={searchQuerySeries}
                    onChange={handleInputChange}
                    disabled={loading} // Disable input when loading
                />
                <Button className='sub-sub-heading-font' onClick={handleSearchSeries} disabled={loading}> {/* Disable button when loading */}
                    {loading ? 'Searching...' : 'Search'}
                </Button>
            </div>
            
            {loading && <Loader />}
        </div>
    );
};

export default Page;