"use client";

import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Loader from '@/components/loader/loader'; // Assuming you have a Loader component

const Page = () => {
    const { searchQuerySeries, result, setSeasons } = useStateContext();
    const [loading, setLoading] = useState(false); // Track loading state

    const router = useRouter();

    const handleGetSeasons = async ({ link }: { link: string }) => {
        setLoading(true); // Start loading
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
                router.push('/webseries/seasons');
            } else {
                console.error('Failed to fetch seasons');
            }
        } catch (error) {
            console.error('Error fetching seasons', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="w-full mt-12 flex flex-col gap-8 items-center justify-start px-4 sm:px-6 md:px-8">
            {/* Search bar and title */}
            <div className="text-4xl sub-heading-font sm:text-5xl font-bold text-center mb-6">
                Articles related to {searchQuerySeries}
            </div>

            {loading && (
                <div className="text-lg sub-sub-heading-font font-semibold text-center mb-4">
                    Please wait while we fetch the seasons...
                </div>
            )}

            {/* Mapped result content with blur effect when loading */}
            <div className={`${loading ? 'blur-lg' : ''} w-full flex flex-col gap-8 items-center`}>
                {result.length === 0 ? (
                    <div className="text-lg sub-sub-heading-font font-semibold text-center">
                        No results found for {searchQuerySeries}
                    </div>
                ) : (
                    result.map((series, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-4 p-6 rounded-lg shadow-md w-full sm:w-[80%] md:w-[60%] lg:w-[40%]"
                        >
                            <div className="text-lg sub-sub-heading-font font-semibold text-center">{series.title}</div>
                            <button
                                onClick={() => handleGetSeasons({ link: series.link })}
                                className="bg-blue-500 sub-sub-heading-font text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
                                disabled={loading}
                            >
                                {loading ? 'Fetching...' : 'Get Seasons'}
                            </button>
                        </div>
                    ))
                )}
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
