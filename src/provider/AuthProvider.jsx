import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import firebaseService from '../services/firebase.services';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        let unSubscribe = onAuthStateChanged(firebaseService.auth, (user) => {
            setCurrentUser(user);
        })

        return () => {
            unSubscribe();
        }
    }, [])

    return <AuthContext.Provider value={{ currentUser }}>
        {children}
    </AuthContext.Provider>
}

