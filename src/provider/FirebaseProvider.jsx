import { createContext } from 'react';
import { firebase } from '../utils/firebase';

const FirebaseContext = createContext(null)

export default function FirebaseProvider({ children }) {

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}

export { FirebaseContext }