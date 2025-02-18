import { useContext, useState } from 'react';
import firebaseService from '../services/firebase.services';
import { generateConversationId, timeAgo } from '../utils/common';
import { useChats } from '../hooks/useChats';
import { AuthContext } from '../provider/AuthProvider';
import { useError } from '../hooks/useError';
import { useLoading } from '../hooks/useLoading';
import { CgArrowLongLeft } from 'react-icons/cg';

const ChatContainer = ({ user, setCurrentChat }) => {
    const [message, setMessage] = useState('');
    const { chats } = useChats();
    const { loading, startLoading, stopLoading } = useLoading();
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
                {
                    user && <>
                        <div className='relative w-full h-[50px] px-2 flex justify-between items-center bg-slate-950 text-white' >
                            <button onClick={() => setCurrentChat(null)}> <CgArrowLongLeft size={'32px'} /></button>
                            <p>{user?.email}</p>
                        </div>
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
                        {user?.id && <div className="w-full flex gap-2 px-4 py-2 border-t-[1px] border-slate-600">
                            <input className="w-full px-2 py-1 border-[1px] border-slate-900 rounded-md bg-transparent" type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Message' />
                            <button className={`px-4 py-1 bg-slate-800 text-white rounded-md hover:bg-black font-bold`} onClick={() => onMessageSend()}>
                                {loading ? <p>loading...</p> : <p>send</p>}
                            </button>
                        </div>}
                    </>
                }
            </div >
        }
    </>
}

export default ChatContainer;