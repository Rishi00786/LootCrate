/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useStateContext } from '@/context';
import React, { useState } from 'react';
import Loader from '@/components/loader/loader'; // Assuming you have a Loader component

const Page = () => {
    const { episodes, searchQuerySeries } = useStateContext();
    const [loading, setLoading] = useState(false); // Track loading state

    const handleDownloadEpisode = async ({ link, fileName }: { link: string; fileName: string }) => {
        console.log(link);
        setLoading(true); // Start loading
        try {
            const response = await fetch('/api/webseries/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link, fileName }),
            });

            if (response.ok) {
                const { downloadLink } = await response.json();
                if (downloadLink) {
                    const a = document.createElement('a');
                    a.href = downloadLink;
                    a.download = ''; // This will prompt a download
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a); // Clean up
                } else {
                    console.error('No download link found');
                }
            } else {
                console.error('Failed to download episode');
            }
        } catch (error) {
            console.error('Error downloading episode:', error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="w-full mt-12 flex flex-col gap-8 items-center justify-start px-4 sm:px-6 md:px-8">
            <div className="text-4xl sub-heading-font sm:text-5xl font-bold text-center mb-6">
                Episodes related to {searchQuerySeries}
            </div>

            {loading && (
                <div className="text-lg sub-sub-heading-font font-semibold text-center mb-4">
                    Please wait while we prepare the download...
                </div>
            )}

            {/* Mapped result content with blur effect when loading */}
            <div className={`${loading ? 'blur-lg' : ''} w-full flex flex-col gap-8 items-center`}>
                {episodes.length > 0 ? (
                    episodes.map((episode, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-4 p-6 rounded-lg shadow-md w-full sm:w-[80%] md:w-[60%] lg:w-[40%]"
                        >
                            <div className="text-lg sub-sub-heading-font font-semibold text-center">
                                {episode.fileName ? episode.fileName : episode.linkText}
                            </div>
                            <button
                                onClick={() => {
                                    const link = episode.fileName ? episode.linkText : episode.finalLink;
                                    const fileName = episode.fileName || episode.linkText;
                                    if (link) {
                                        handleDownloadEpisode({
                                            link: link || '', // Ensure link is not null
                                            fileName: fileName || '', // Ensure fileName is not null
                                        });
                                    }
                                }}
                                className="bg-green-500 sub-sub-heading-font text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 w-full sm:w-auto"
                                disabled={loading}
                            >
                                {loading ? 'Downloading...' : 'Download Episode'}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className='sub-sub-heading-font'>No episodes available.</div>
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
