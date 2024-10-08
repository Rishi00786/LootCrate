"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StateContextType {
    sidebar: boolean;
    setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    result: MovieResult[];
    setResult: React.Dispatch<React.SetStateAction<MovieResult[]>>;
    seasons: SeasonInfo[];
    setSeasons: React.Dispatch<React.SetStateAction<SeasonInfo[]>>;
    episodes: EpisodeInfo[];
    setEpisodes: React.Dispatch<React.SetStateAction<EpisodeInfo[]>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

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

const StateContext = createContext<StateContextType | undefined>(undefined);

export const useStateContext = () => {
    const context = useContext(StateContext);
    if (!context) {
        throw new Error('useStateContext must be used within a StateProvider');
    }
    return context;
};

export const StateProvider = ({ children }: { children: ReactNode }) => {

    const [sidebar, setSidebar] = useState<boolean>(false);
    const [result, setResult] = useState<MovieResult[]>([]);
    const [seasons, setSeasons] = useState<SeasonInfo[]>([]);
    const [episodes, setEpisodes] = useState<EpisodeInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <StateContext.Provider value={{ 
            sidebar, setSidebar, 
            result, setResult, 
            seasons, setSeasons, 
            episodes, setEpisodes,
            searchQuery, setSearchQuery 
        }}>
            {children}
        </StateContext.Provider>
    );
};