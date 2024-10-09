"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/ui2/Navbar';
import Loader from '@/components/loader/loader'; // Import your Loader component
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

// Define the SongResult type
interface SongResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
    duration: string;
  };
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<SongResult[]>([]);
  const [loading, setLoading] = useState(false); // Loader state for searching
  const [downloading, setDownloading] = useState(false); // Loader state for downloading

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSong = async () => {
    if (searchQuery.trim()) {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`/api/songs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ searchQuery }),
        });

        if (response.ok) {
          const data = await response.json();
          setResult(data.youtubeResults || []); // Update to use youtubeResults
        } else {
          console.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error searching for song:', error);
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const handleSongDownload = async ({ videoId, videoTitle, videoURL }: { videoURL: string; videoTitle: string; videoId: string }) => {
    setDownloading(true); // Start downloading
    try {
      const response = await fetch('/api/songs/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoURL, videoTitle, videoId }),
      });

      if (response.ok) {
        const data = await response.json();
        const downloadLink = data.downloadLink;
        if (downloadLink === undefined) {
          alert('Please try any other choice.'); // Alert if no download link is returned
        }

        if (downloadLink) {
          const a = document.createElement('a');
          a.href = downloadLink; // Set the URL to the download link
          a.download = `${videoTitle}.mp3`; // Set the file name for the download
          document.body.appendChild(a); // Append the anchor to the body
          a.click(); // Simulate click to trigger download
          document.body.removeChild(a); // Remove the anchor from the document
        }
      } else {
        console.error('Failed to save song');
      }
    } catch (error) {
      console.error('Error downloading song:', error);
    } finally {
      setDownloading(false); // End downloading
    }
  };

  return (
    <div className={cn("w-[100vw] min-h-screen")}>
      <Navbar />
      <div className={`w-full mt-12 flex flex-col gap-8 items-center justify-start px-4`}>
        <div className='text-4xl sm:text-5xl font-bold text-center text-black dark:text-white sub-heading-font'>
          Search for Song
        </div>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Input
            className='w-full sm:w-[40vw] h-12 mb-4 sm:mb-0'
            type='text'
            placeholder='e.g. Money Rain Phonk'
            value={searchQuery}
            onChange={handleInputChange}
          />
          <div className='flex items-center sub-sub-heading-font justify-center'>
            <Button onClick={handleSearchSong}>Search</Button>
          </div>
        </div>
        
          <div className={`mt-8 ${loading || downloading ? 'blur-lg' : ''} flex flex-col gap-8 items-center justify-center w-full`}>
            {result.map((item, index) => (
              <div key={index} className='flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full sm:w-[80vw] lg:w-[60vw]'>
                <div className='flex flex-col items-center justify-center w-full rounded-lg shadow-lg p-4'>
                  <div className='text-lg sub-sub-heading-font sm:text-2xl font-bold text-center'>
                    {item.snippet.title}
                  </div>
                  <div className='text-sm sub-sub-heading-font text-center text-gray-400 mt-2'>
                    {item.snippet.channelTitle}
                  </div>
                  <div className='text-xs sub-sub-heading-font sm:text-sm text-center text-teal-600 mt-1'>
                    Published on: {new Date(item.snippet.publishedAt).toLocaleDateString()}
                  </div>
                  <div className='flex justify-center gap-4 mt-4'>
                    <div
                      onClick={() => handleSongDownload({
                        videoId: item.id.videoId,
                        videoTitle: item.snippet.title,
                        videoURL: `https://www.youtube.com/watch?v=${item.id.videoId}`
                      })}
                      className='flex cursor-pointer items-center justify-center bg-yellow-700 p-3 rounded-lg shadow-md transition duration-200 hover:bg-yellow-600'
                    >
                      <div className='text-lg sub-sub-heading-font sm:text-xl text-white font-semibold'>
                        Download
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>

      {(loading || downloading) && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 z-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Page;