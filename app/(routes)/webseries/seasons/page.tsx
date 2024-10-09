/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Loader from '@/components/loader/loader'; // Assuming you have a Loader component

interface EpisodeInfo {
    fileName?: string;
    linkText: string;
    finalLink?: string;
}

const Page = () => {
    const { searchQuerySeries, seasons, setEpisodes } = useStateContext();
    const [loading, setLoading] = useState(false); // Track loading state

    const router = useRouter();

    const handleGetEpisodes = async ({ link }: { link: string }) => {
        setLoading(true); // Start loading
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
                router.push('/webseries/episodes');
            } else {
                console.error('Failed to fetch episodes');
            }
        } catch (error) {
            console.error('Error fetching episodes', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="w-full mt-12 flex flex-col gap-8 items-center justify-start px-4 sm:px-6 md:px-8">
            <div className="text-4xl sub-heading-font sm:text-5xl font-bold text-center mb-6">
                Seasons related to {searchQuerySeries}
            </div>

            {loading && (
                <div className="text-lg sub-sub-heading-font font-semibold text-center mb-4">
                    Please wait while we fetch the episodes...
                </div>
            )}

            {/* Mapped result content with blur effect when loading */}
            <div className={`${loading ? 'blur-lg' : ''} w-full flex flex-col gap-8 items-center`}>
                {seasons.map((season, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-4 p-6 rounded-lg shadow-md w-full sm:w-[80%] md:w-[60%] lg:w-[40%]"
                    >
                        <div className="text-lg font-semibold text-center sub-sub-heading-font">{season.seasonInfo.join(', ')}</div>
                        <button
                            onClick={() => handleGetEpisodes({ link: season.googleDriveLink })}
                            className="bg-green-500 sub-sub-heading-font text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 w-full sm:w-auto"
                            disabled={loading}
                        >
                            {loading ? 'Fetching Episodes...' : 'Get Episodes'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Loader below the search bar */}
            {loading && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 z-10">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Page;