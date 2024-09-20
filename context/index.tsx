"use client"
// context.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StateContextType {
    sidebar: boolean;
    setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
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

    return (
        <StateContext.Provider value={{ sidebar, setSidebar }}>
            {children}
        </StateContext.Provider>
    )
}