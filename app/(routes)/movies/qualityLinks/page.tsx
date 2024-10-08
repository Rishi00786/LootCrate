/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useStateContext } from '@/context';
// import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
    const { searchQueryMovies, qualityLinks } = useStateContext();

    // const router = useRouter();

    const handleDownloadMovie = async ({ link, fileName }: { link: string; fileName: string }) => {
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
                console.log(downloadLink)
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
        }
    };

    // Filter out seasons that contain "10bit" or "HCVC" in any element of seasonInfo
    const filteredQualityLinks = qualityLinks.filter(season => {
        return !season.seasonInfo.some(info => info.includes('10bit') || info.includes('HCVC'));
    });

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='text-5xl font-bold mb-8 mt-4'>
                Quality Links related To {searchQueryMovies}
            </div>
            {filteredQualityLinks.length === 0 ? (
                <p>No valid quality links found for {searchQueryMovies}.</p>
            ) : (
                filteredQualityLinks.map((season, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md">
                        <div className="text-lg font-semibold">{season.seasonInfo.join(', ')}</div>
                        <button
                            onClick={() => handleDownloadMovie({ link: season.googleDriveLink, fileName: season.seasonInfo.flat().join(' ') })}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                            Download
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Page;