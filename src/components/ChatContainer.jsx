import { useContext, useEffect, useRef, useState } from 'react';
import { getFirestore, collection, query, orderBy, getDocs, doc, setDoc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from '../provider/AuthProvider';
import moment from 'moment';

function ChatContainer({ user }) {
    const { currentUser } = useContext(AuthContext);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const chatContainerRef = useRef(null);

    const db = getFirestore();

    async function onMessageSend() {
        try {
            if (message.trim() !== '') {

                const conversationId = [currentUser.uid, user.id].sort().join("_");

                const chatSnapshot = await getDoc(doc(db, "chats", conversationId));

                if (!chatSnapshot.exists()) {
                    // create conversations of current user
                    await setDoc(doc(db, 'users', currentUser.uid, 'conversations', conversationId), {
                        timestamp: serverTimestamp(),
                        userInfo: {
                            id: user.id,
                            email: user.email,
                        }
                    });

                    // create conversations of another user
                    await setDoc(doc(db, 'users', user.id, 'conversations', conversationId), {
                        timestamp: serverTimestamp(),
                        userInfo: {
                            id: currentUser.uid,
                            email: currentUser.email,
                        }
                    });
                }

                await addDoc(collection(db, "chats", conversationId, 'messages'), {
                    from: currentUser.uid,
                    to: user.id,
                    message: message.trim(),
                    timestamp: serverTimestamp()
                });

            }
            setMessage('');
            fetchMesssages(user);
        } catch (error) {
            console.error("Error adding conversation: ", error);
        }
    }


    async function fetchMesssages(user) {
        if (!user?.id) return;

        const conversationId = [currentUser.uid, user.id].sort().join("_");

        const messagesRef = collection(db, "chats", conversationId, "messages");
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);

        let messages = [];

        querySnapshot.forEach((doc) => {
            messages.push(doc.data());
        });

        setMessages(messages);
    }

    useEffect(() => {
        fetchMesssages(user);
    }, [user?.id])

    const timeAgo = (timestamp) => {
        let date = timestamp.toDate();
        return moment(date).fromNow();
    };

    useEffect(() => {
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);

    return <>
        <div className="w-full h-full bg-green-100 flex flex-col justify-end">
            <div ref={chatContainerRef} className="w-full h-full p-2 flex flex-col gap-2 overflow-auto">
                {
                    messages && messages.map((message) => {
                        return <div key={`${message.timestamp.seconds + message.message}`} className=""
                            style={{
                                placeSelf: (message.from === currentUser.uid) ? 'end' : 'start',
                            }} >
                            <p style={{
                                backgroundColor: (message.from === currentUser.uid) ? '#86efac' : '#93c5fd',
                            }} className="py-1 px-3 rounded-full text-center">{message.message}</p>
                            <p className='text-[12px]'>{timeAgo(message.timestamp)}</p>
                        </div>
                    })
                }
            </div>
            {user?.id && <div className="w-full flex gap-2 p-4 bg-slate-100">
                <input className="w-full px-2 py-1 border-[1px] border-slate-400 rounded-md" type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Message' />
                <button className="px-4 py-1 bg-slate-700 text-white rounded-md hover:bg-slate-900" onClick={() => onMessageSend()}>send</button>
            </div>}
        </div >
    </>
}

export default ChatContainer;