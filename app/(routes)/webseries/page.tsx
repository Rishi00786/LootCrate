/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/ui2/Navbar';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface MovieResult {
    title: string;
    link: string;
}

interface SeasonInfo {
    seasonInfo: string[];
    googleDriveLink: string;
}

interface EpisodeInfo {
    fileName?: string;
    linkText: string;
    finalLink?: string;
}

const Page = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState<MovieResult[]>([]);
    const [seasons, setSeasons] = useState<SeasonInfo[]>([]);
    const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSeries = async () => {
        if (searchQuery.trim()) {
            try {
                const response = await fetch(`/api/webseries`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ searchQuery }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setResult(data.articles || []);
                    setSeasons([]);
                    setEpisodes([]);
                } else {
                    console.error('Failed to fetch search results');
                }
            } catch (error) {
                console.error('Error searching for series:', error);
            }
        }
    };

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
                setEpisodes([]);
                setResult([]);
            } else {
                console.error('Failed to fetch seasons');
            }
        } catch (error) {
            console.error('Error fetching seasons', error);
        }
    };

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
                setSeasons([]);
                setResult([]);
            } else {
                console.error('Failed to fetch episodes');
            }
        } catch (error) {
            console.error('Error fetching episodes', error);
        }
    };

    const handleDownloadEpisode = async ({ link, fileName }: { link: string; fileName: string }) => {
        console.log(link)
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
                // console.log("response", response.json())
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
        <div className={cn("bg-gradient-to-r w-[100vw] min-h-screen from-blue-500 to-purple-500 dark:from-black dark:to-gray-800")}>
            <Navbar />
            <div className={`w-[100vw] mt-12 flex flex-col gap-8 items-center justify-start`}>
                <div className='text-5xl font-bold'>Search for WebSeries</div>
                <div className='flex items-center justify-center gap-4'>
                    <Input
                        className='w-[40vw] h-12'
                        type='text'
                        placeholder='e.g. Money Heist'
                        value={searchQuery}
                        onChange={handleInputChange}
                    />
                    <Button onClick={handleSearchSeries}>Search</Button>
                </div>
                <div className='mt-8 flex flex-col gap-12 items-center justify-center'>
                    {episodes.length > 0 ? (
                        episodes.map((episode, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md">
                                {episode.fileName ? <div className="text-lg font-semibold">{episode.fileName}</div>
                                                :   <div className="text-lg font-semibold">{episode.linkText}</div>
                            }
                                {/* {episode.file && <div className="text-lg font-semibold">{episode.fileName}</div>} */}
                                <button
                                    onClick={() => {
                                        if (episode.fileName ) { // Ensure both fileName and linkText are defined
                                            handleDownloadEpisode({
                                                link:  episode.linkText || '', // Provide a fallback empty string
                                                fileName: episode.fileName  // Provide a fallback empty string
                                            });
                                        } else {
                                            handleDownloadEpisode({
                                                link:  episode.finalLink || '', // Provide a fallback empty string
                                                fileName: episode.linkText  // Provide a fallback empty string
                                            });                                        }
                                    }}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                                >
                                    Download Episode
                                </button>


                            </div>
                        ))
                    ) : seasons.length > 0 ? (
                        seasons.map((season, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md">
                                <div className="text-lg font-semibold">{season.seasonInfo.join(', ')}</div>
                                <button
                                    onClick={() => handleGetEpisodes({ link: season.googleDriveLink })}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                                >
                                    Get Episodes
                                </button>
                            </div>
                        ))
                    ) : result.length > 0 ? (
                        result.map((series, index) => (
                            <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md">
                                <div className="text-lg font-semibold">{series.title}</div>
                                <button
                                    onClick={() => handleGetSeasons({ link: series.link })}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Get Seasons
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-lg font-semibold">No results found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;