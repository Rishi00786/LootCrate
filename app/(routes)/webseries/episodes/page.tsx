/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useStateContext } from '@/context';
import React from 'react';

const Page = () => {
    const { episodes , searchQuery } = useStateContext();

    const handleDownloadEpisode = async ({ link, fileName }: { link: string; fileName: string }) => {
        console.log(link);
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
        }
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='text-5xl font-bold mb-8 mt-20'>
                Episodes related To {searchQuery}
            </div>
            {episodes.length > 0 ? (
                episodes.map((episode, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md">
                        {episode.fileName ? (
                            <div className="text-lg font-semibold">{episode.fileName}</div>
                        ) : (
                            <div className="text-lg font-semibold">{episode.linkText}</div>
                        )}
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
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                            Download Episode
                        </button>
                    </div>
                ))
            ) : (
                <div>No episodes available.</div>
            )}
        </div>
    );
};

export default Page;