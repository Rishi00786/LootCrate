/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Loader from '@/components/loader/loader'; // Import your Loader component

const Page = () => {
    const { setMovieResults, setSearchQueryMovies, searchQueryMovies } = useStateContext();
    const [loading, setLoading] = useState(false); // Add loading state

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQueryMovies(event.target.value);
    };

    const router = useRouter();

    const handleSearchMovies = async () => {
        if (searchQueryMovies.trim()) {
            setLoading(true); // Start loading
            try {
                const response = await fetch(`/api/movies`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchQueryMovies }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setMovieResults(data.articles || []);
                    router.push('/movies/articles');
                } else {
                    console.error('Failed to fetch search results');
                }
            } catch (error) {
                console.error('Error searching for movies:', error);
            } finally {
                setLoading(false); // End loading
            }
        }
    };

    return (
        <div className={`w-full mt-12 flex flex-col gap-8 items-center justify-start px-4`}>
            <div className='text-4xl sub-heading-font sm:text-5xl font-bold text-center'>Search for Movies</div>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                <Input
                    className='w-full sm:w-[40vw] h-12 mb-4 sm:mb-0'
                    type='text'
                    placeholder='e.g. Inception'
                    value={searchQueryMovies}
                    onChange={handleInputChange}
                    disabled={loading}
                />
                <Button className='sub-sub-heading-font' onClick={handleSearchMovies} disabled={loading}> {/* Disable button while loading */}
                    {loading ? 'Searching...' : 'Search'}
                </Button>
            </div>
            
            {loading && <Loader />}
        </div>
    );
};

export default Page;