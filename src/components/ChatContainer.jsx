import { forwardRef, useContext, useState } from 'react';
import firebaseService from '../services/firebase.services';
import { generateConversationId, timeAgo } from '../utils/common';
import { useChats } from '../hooks/useChats';
import { AuthContext } from '../provider/AuthProvider';
import { useError } from '../hooks/useError';
import { LoadingContext } from '../provider/loadingProvider';

const ChatContainer = ({ user }) => {
    const [message, setMessage] = useState('');
    const { chats } = useChats();
    const { startLoading, stopLoading } = useContext(LoadingContext);
    const { setError } = useError();

    const { currentUser } = useContext(AuthContext);

    let conversationId;
    if (user?.id && currentUser?.uid) {
        conversationId = generateConversationId(currentUser.uid, user.id);
    }

    async function onMessageSend() {
        if (!user?.id && !currentUser?.uid) return;
        startLoading();
        try {
            await firebaseService.onMessageSend(message, currentUser, user);
            setMessage('');
        } catch (error) {
            setError('Error occurred! please try again.')
        } finally {
            stopLoading();
        }
    }

    return <>
        {
            <div className="w-full h-full bg-green-100 flex flex-col justify-end">
                <div className="w-full h-full p-2 flex flex-col-reverse gap-2 overflow-auto">
                    {
                        user?.id && chats[conversationId] && chats[conversationId].map((message) => {
                            return <div key={message.id} className=""
                                style={{
                                    placeSelf: (message.from === currentUser?.uid) ? 'end' : 'start',
                                }} >
                                <p style={{
                                    backgroundColor: (message.from === currentUser?.uid) ? '#86efac' : '#93c5fd',
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
        }
    </>
}

export default ChatContainer;