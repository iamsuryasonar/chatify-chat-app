import { useState, useEffect, useContext } from "react";
import firebaseService from "../services/firebase.services";
import { AuthContext } from '../provider/AuthProvider';
import { useError } from "./useError";
import { LoadingContext } from "../provider/loadingProvider";

export const useConversations = () => {
    const [conversations, setConversations] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const { startLoading, stopLoading } = useContext(LoadingContext);
    const { setError } = useError();

    useEffect(() => {
        let unsubscribe;

        startLoading()
        try {
            unsubscribe = firebaseService.listenToConversations(currentUser, (conversation) => {
                setConversations(conversation);
            });

        } catch (err) {
            setError('Error occurred while retrieving conversation')
        } finally {
            stopLoading()
        }

        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        }
    }, [currentUser])

    return { conversations };
}