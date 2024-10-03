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
          console.log(data);
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
        console.log('Song saved successfully:', data);

        const downloadLink = data.downloadLink;
        console.log(downloadLink);

        if(downloadLink == undefined){
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
      } else{
        console.error('Failed to save song');
      }
    } catch (error) {
      console.error('Error downloading song:', error);
    } finally {
      setDownloading(false); // End downloading
    }
  };

  return (
    <div className={cn(
      "bg-gradient-to-r w-[100vw] min-h-screen from-blue-500 to-purple-500 dark:from-black dark:to-gray-800"
    )}>
      <Navbar />
      <div className={`w-[100vw] mt-12 flex flex-col gap-8 items-center justify-start`}>

        <>
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
          {downloading && <Loader />} {/* Show loader during download */}
          {loading ? <Loader /> : (
            <div className={`mt-8 ${downloading ? 'blur-lg' : ''} flex flex-col gap-12 items-center justify-center`}>
              {result.map((item, index) => (
                <div key={index} className='flex items-center justify-center gap-8 w-[60vw] h-full rounded-lg shadow-lg overflow-hidden p-4'>
                  <div className='flex flex-col items-center justify-center h-[25vh] w-full'>
                    <div className='flex flex-col items-center flex-grow'>
                      <div className='text-2xl font-bold text-white text-center'>{item.snippet.title}</div>
                      <div className='flex items-center justify-center gap-4 mt-2'>
                        <div className='text-sm text-gray-300'>By: {item.snippet.channelTitle}</div>
                        <div className='text-sm text-gray-300'>PublishedAt: {new Date(item.snippet.publishedAt).toLocaleDateString()}</div>
                        <div className='text-sm text-gray-300'>Duration: TBD</div>
                      </div>
                    </div>
                    <div
                      onClick={() => handleSongDownload({
                        videoId: item.id.videoId,
                        videoTitle: item.snippet.title,
                        videoURL: `https://www.youtube.com/watch?v=${item.id.videoId}`
                      })}
                      className='flex cursor-pointer w-56 items-center justify-center bg-yellow-700 p-3 rounded-lg shadow-md transition duration-200 hover:bg-yellow-600'
                    >
                      <div className='text-lg text-white font-semibold'>Download</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Page;