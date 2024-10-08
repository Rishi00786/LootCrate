/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';
import React from 'react';

interface EpisodeInfo {
    fileName?: string;
    linkText: string;
    finalLink?: string;
}

const Page = () => {
    const { searchQuery,
        seasons,
        setEpisodes
    } = useStateContext();

    const router = useRouter()

    const handleGetEpisodes = async ({ link }: { link: string }) => {
        try {
            const response = await fetch('/api/webseries/episodes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link }),
            });

            if (response.ok) {
                const data = await response.json();
                const episodeArray: EpisodeInfo[] = Object.values(data);
                setEpisodes(episodeArray);
                router.push('/webseries/episodes')
            } else {
                console.error('Failed to fetch episodes');
            }
        } catch (error) {
            console.error('Error fetching episodes', error);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='text-5xl font-bold mb-8 mt-4'>
                Seasons related To {searchQuery}
            </div>
            {seasons.map((season, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md">
                    <div className="text-lg font-semibold">{season.seasonInfo.join(', ')}</div>
                    <button
                        onClick={() => handleGetEpisodes({ link: season.googleDriveLink })}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                        Get Episodes
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Page;