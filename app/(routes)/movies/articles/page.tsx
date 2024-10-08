/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useStateContext } from '@/context'
import { useRouter } from 'next/navigation'
import React from 'react'

const page = () => {
    
    const router = useRouter()

    const {setQualityLinks,  searchQueryMovies , movieResults }  = useStateContext()


    const handleGetQualityLinks = async ({ link }: { link: string }) => {
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
                router.push('/movies/qualityLinks')
            } else {
                console.error('Failed to fetch seasons');
            }
        } catch (error) {
            console.error('Error fetching QualityLinks', error);
        }
    }


  return (
    <div className='flex flex-col items-center justify-center'>
            <div className='text-5xl font-bold mb-8 mt-4'>
                Articles related To {searchQueryMovies}
            </div>
            {movieResults.map((series, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-4 rounded-lg shadow-md">
                    <div className="text-lg font-semibold">{series.title}</div>
                    <button
                        onClick={() => handleGetQualityLinks({ link: series.link })}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Get DownloadLinks
                    </button>
                </div>
            ))}
        </div>
  )
}

export default page
