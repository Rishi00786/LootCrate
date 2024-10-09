"use client";

import { useStateContext } from '@/context';
import React, { useState } from 'react';
import Loader from '@/components/loader/loader'; // Import your loader component

const Page = () => {
    const { searchQueryMovies, qualityLinks } = useStateContext();
    const [loading, setLoading] = useState(false); // Track the loading state for API actions

    const handleDownloadMovie = async ({ link, fileName }: { link: string; fileName: string }) => {
        setLoading(true); // Show loader when starting download
        try {
            const response = await fetch('/api/movies/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link, fileName }),
            });

            if (response.ok) {
                const { downloadLink } = await response.json();
                if (downloadLink.includes('filepress')) {
                    // If it's a FilePress link, alert the user
                    alert(`Go to this link to download the file: ${downloadLink}`);
                } else if (downloadLink.includes('pixeldra')) {
                    // Handle direct download for non-FilePress links
                    const a = document.createElement('a');
                    a.href = downloadLink;
                    a.download = fileName; // Use the file name for the download
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a); // Clean up
                } else {
                    console.error('Unknown download link type');
                }
            } else {
                console.error('Failed to download episode');
            }
        } catch (error) {
            console.error('Error downloading episode:', error);
        } finally {
            setLoading(false); // Hide loader once download is complete
        }
    };

    // Filter out seasons that contain "10bit" or "HCVC" in any element of seasonInfo
    const filteredQualityLinks = qualityLinks.filter(season => {
        return !season.seasonInfo.some(info => info.includes('10bit') || info.includes('HCVC'));
    });

    return (
        <div className="flex flex-col items-center justify-center px-4 py-8">
            <div className="text-4xl sub-heading-font sm:text-5xl font-bold mb-8 mt-4 text-center">
                Quality Links related to {searchQueryMovies}
            </div>

            <div className={`${loading ? 'blur-lg' : ''} w-full flex flex-col gap-8 items-center`}>
                {filteredQualityLinks.length === 0 ? (
                    <p className='sub-sub-heading-font'>No valid quality links found for {searchQueryMovies}.</p>
                ) : (
                    filteredQualityLinks.map((season, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-4 p-4 rounded-lg shadow-md w-full sm:w-[80vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw]"
                        >
                            <div className="text-lg sub-sub-heading-font sm:text-xl font-semibold text-center">
                                {season.seasonInfo.join(', ')}
                            </div>
                            <button
                                onClick={() => handleDownloadMovie({
                                    link: season.googleDriveLink,
                                    fileName: `${season.seasonInfo.join('-')}.mp4`, // More readable file name
                                })}
                                className="bg-green-500 sub-sub-heading-font text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 w-full sm:w-auto"
                                disabled={loading} // Disable button during loading
                            >
                                {loading ? 'Downloading...' : 'Download'}
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