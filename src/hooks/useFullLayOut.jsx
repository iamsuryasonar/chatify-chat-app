import { createContext, useContext, useState } from "react";

const FullLayoutContext = createContext();

export const FullLayoutProvider = ({ children }) => {
    const [isFullLayout, setIsFullLayout] = useState(false);

    return (
        <FullLayoutContext.Provider value={{ isFullLayout, setIsFullLayout }}>
            {children}
        </FullLayoutContext.Provider>
    );
};

export const useFullLayOut = () => {
    return useContext(FullLayoutContext);
};