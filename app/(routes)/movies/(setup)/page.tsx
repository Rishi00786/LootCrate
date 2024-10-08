/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {

    const { setMovieResults ,setSearchQueryMovies , searchQueryMovies }  = useStateContext()


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQueryMovies(event.target.value);
    };

    const router = useRouter()

    const handleSearchMovies = async () => {
        if (searchQueryMovies.trim()) {
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
                    router.push('/movies/articles')
                } else {
                    console.error('Failed to fetch search results');
                }
            } catch (error) {
                console.error('Error searching for series:', error);
            }
        }
    }

    return (
        <div className={`w-[100vw] mt-12 flex flex-col gap-8 items-center justify-start`}>
            <div className='text-5xl font-bold'>Search for Movies</div>
            <div className='flex items-center justify-center gap-4'>
                <Input
                    className='w-[40vw] h-12'
                    type='text'
                    placeholder='e.g. Inception'
                    value={searchQueryMovies}
                    onChange={handleInputChange}
                />
                <Button onClick={handleSearchMovies}>Search</Button>
            </div>
        </div>
    );
};

export default Page;