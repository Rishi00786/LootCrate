"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/ui2/Navbar';
import { cn } from '@/lib/utils';
import Image from 'next/image';
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
  };
}

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<SongResult[]>([]); // Update the type here

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSong = async () => {
    if (searchQuery.trim()) {
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
          console.log(data);
          setResult(data.youtubeResults || []); // Update to use youtubeResults
        } else {
          console.error('Failed to fetch search results');
        }
      } catch (error) {
        console.error('Error searching for song:', error);
      }
    }
  };

  const handleSongDownload = async ({ videoURL }: { videoURL: string }) => {
    try {
      const response = await fetch('/api/songs/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoURL }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Song saved successfully:', data);
      } else {
        console.error('Failed to save song');
      }
    } catch (error) {
      console.error('Error downloading song:', error);
    }
  };


  return (
    <div className={cn(
      "bg-gradient-to-r w-[100vw] min-h-screen from-blue-500 to-purple-500 dark:from-black dark:to-gray-800"
    )}>
      <Navbar />
      <div className='w-[100vw] mt-12 flex flex-col gap-8 items-center justify-start'>
        <div className='text-5xl font-bold'>Search for Song</div>
        <div className='flex item-center justify-center gap-4'>
          <Input
            className='w-[40vw] h-12'
            type='text'
            placeholder='e.g. Perfect by Ed Sheeran'
            value={searchQuery}
            onChange={handleInputChange}
          />
          <div className='flex items-center justify-center'>
            <Button onClick={handleSearchSong}>Search</Button>
          </div>
        </div>
        <div className='mt-8 flex flex-col gap-12 items-center justify-center'>
          {result.map((item, index) => (
            <div key={index} className='flex items-start justify-center gap-8 w-[60vw] h-full rounded-lg shadow-lg overflow-hidden p-4'>
              <div className='flex items-center justify-center'>
                <Image
                  src={item.snippet.thumbnails.default.url}
                  alt={item.snippet.title}
                  className='rounded-lg shadow-md'
                  width={400}
                  height={300}
                />
              </div>
              <div className='flex flex-col justify-between h-[25vh] w-full'>
                <div className='flex flex-col items-start flex-grow'>
                  <div className='text-2xl font-bold text-white truncate'>{item.snippet.title}</div>
                  <div className='flex items-center justify-start gap-4 mt-2'>
                    <div className='text-sm text-gray-300'>BY: {item.snippet.channelTitle}</div>
                    <div className='text-sm text-gray-300'>Published: {new Date(item.snippet.publishedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div
                  onClick={() => handleSongDownload({ videoURL: `https://www.youtube.com/watch?v=${item.id.videoId}` })}
                  className='flex w-56 items-center justify-center bg-yellow-700 p-3 rounded-lg shadow-md transition duration-200 hover:bg-yellow-600'
                >
                  <div className='text-lg text-white font-semibold'>Download</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;