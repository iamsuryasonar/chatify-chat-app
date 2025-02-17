import { useContext, useState } from "react";
import firebaseService from "../services/firebase.services";
import { useEffect } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useConversations } from "./useConversation";
import { useError } from "./useError";
import { LoadingContext } from "../provider/loadingProvider";

export const useChats = () => {
    const [chats, setChats] = useState({});
    const { currentUser } = useContext(AuthContext);
    const { conversations } = useConversations();
    const { startLoading, stopLoading } = useContext(LoadingContext);

    const { setError } = useError();

    useEffect(() => {
        if (!conversations) return;
        let temp = [...conversations];

        try {
            startLoading()
            /* 
            each element of temp will have function to unsubscribe listener to firebase 
        */
            temp.map(conversation => {
                return firebaseService.listenToChats(currentUser, conversation.id, (messages) => {
                    setChats((prev) => {
                        return {
                            ...prev,
                            [conversation.id]: messages,
                        }
                    })
                });
            });
        } catch (err) {
            setError('Error occurred while retrieving conversation')
        } finally {
            stopLoading()
        }

        return () => {
            /* unsubscribing all listeners on component unmount */
            temp.forEach((unSubs) => {
                if (typeof unSubs === 'function') {
                    unSubs();
                }
            })
        }
    }, [currentUser, conversations])


    return { chats };
}