"use client";
import { useStateContext } from '@/context';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Loader from '@/components/loader/loader'; // Make sure to import your loader component

const Page = () => {
    const router = useRouter();
    const { setQualityLinks, searchQueryMovies, movieResults } = useStateContext();
    const [loading, setLoading] = useState(false); // Add loading state for API calls

    const handleGetQualityLinks = async ({ link }: { link: string }) => {
        setLoading(true); // Set loading to true when fetching quality links
        try {
            const response = await fetch('/api/movies/qualityLinks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link }),
            });

            if (response.ok) {
                const data = await response.json();
                setQualityLinks(data.downloadInfo || []);
                router.push('/movies/qualityLinks');
            } else {
                console.error('Failed to fetch quality links');
            }
        } catch (error) {
            console.error('Error fetching Quality Links', error);
        } finally {
            setLoading(false); // Set loading to false once the API call is complete
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-4 py-8">
            <div className="text-4xl sub-heading-font sm:text-5xl font-bold mb-8 mt-4 text-center">
                Articles related to {searchQueryMovies}
            </div>

            {loading && (
                <div className="text-lg sub-sub-heading-font font-semibold text-center mb-4">
                    Please wait while we fetch the movie...
                </div>
            )}
            <div className={`${loading ? 'blur-lg' : ''} w-full flex flex-col gap-8 items-center`}>
                {movieResults.length === 0 ? (
                    <div className="text-lg sub-sub-heading-font font-semibold text-center">
                        No results found for {searchQueryMovies}
                    </div>
                ) : (
                    movieResults.map((movie, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-4 p-4 rounded-lg shadow-md w-full sm:w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw]"
                        >
                            <div className="text-lg sub-sub-heading-font sm:text-xl font-semibold text-center">
                                {movie.title}
                            </div>
                            <button
                                onClick={() => handleGetQualityLinks({ link: movie.link })}
                                className="bg-blue-500 sub-sub-heading-font text-white px-6 py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-auto"
                                disabled={loading} // Disable button during loading
                            >
                                {loading ? 'Fetching Links...' : 'Get Download Links'}
                            </button>
                        </div>
                    ))
                )}
            </div>
            {loading && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 z-10">
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default Page;