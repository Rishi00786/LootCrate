/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
    const { searchQuery,
        result,
        setSeasons,
    } = useStateContext();

    const router = useRouter()

    const handleGetSeasons = async ({ link }: { link: string }) => {
        try {
            const response = await fetch('/api/webseries/seasons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link }),
            });

            if (response.ok) {
                const data = await response.json();
                setSeasons(data.downloadInfo || []);
                router.push('/webseries/seasons')
            } else {
                console.error('Failed to fetch seasons');
            }
        } catch (error) {
            console.error('Error fetching seasons', error);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='text-5xl font-bold mb-8 mt-4'>
                Articles related To {searchQuery}
            </div>
            {result.map((series, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md">
                    <div className="text-lg font-semibold">{series.title}</div>
                    <button
                        onClick={() => handleGetSeasons({ link: series.link })}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Get Seasons
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Page;