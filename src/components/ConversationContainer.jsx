import { useContext, useState } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { IoMdClose, IoMdSearch } from 'react-icons/io';
import firebaseService from '../services/firebase.services';
import { useConversations } from '../hooks/useConversation';
import { useError } from '../hooks/useError';
import { LoadingContext } from '../provider/loadingProvider';
import useLoading from '../hooks/useLoading';

function ConversationContainer({ currentChat, setCurrentChat, showTranslate, }) {
    const [searchEmail, setSearchEmail] = useState('');
    const [searchedEmails, setSearchedEmails] = useState(null);
    const { startLoading, stopLoading } = useContext(LoadingContext);
    // const { startLoading, stopLoading } = useLoading();

    const { setError } = useError();

    const { currentUser } = useContext(AuthContext);

    const { conversations } = useConversations();

    const searchUserByEmail = async (prefix) => {
        try {
            startLoading()
            let data = await firebaseService.searchUserByEmail(prefix);
            setSearchedEmails(data);
        } catch (err) {
            setError('Error occurred! please try again')
        } finally {
            stopLoading()
        }
    };

    function handleSearch() {
        if (searchEmail.length < 4) return;
        searchUserByEmail(searchEmail);
    }

    return <div className="md:max-w-[300px] lg:max-w-[300px] h-full bg-slate-950 flex flex-col gap-2 overflow-auto text-white">
        <div className="flex flex-col items-start">
            <div className='relative m-2'>
                <input type="text" placeholder='Search' className='w-full pl-2 py-1 border-[1px] border-state-300 pr-[30px] bg-transparent'
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                />
                <div className='absolute right-[4px] top-1/2 bottom-1/2 -translate-y-1/2 flex gap-[1px] items-center'>
                    {
                        searchEmail && <IoMdClose onClick={() => {
                            setSearchEmail('');
                            setSearchedEmails(null)
                        }} size={'26px'} className='cursor-pointer aspect-square p-1 hover:bg-slate-700 rounded-full' />
                    }
                    {/* //todo: debounce search call and replace search icon button with clear icon button */}
                    <IoMdSearch onClick={handleSearch} size={'26px'} className='cursor-pointer aspect-square p-1 hover:bg-slate-700 rounded-full' />
                </div>
            </div>
            {
                searchedEmails && searchedEmails.map((conversation) => {
                    return <div className='w-full' key={conversation.id}>
                        <button className='w-full text-start p-2 bg-slate-900 hover:bg-slate-700' onClick={() => setCurrentChat(conversation)} >{conversation.email}</button>
                    </div>
                })
            }
            {
                searchedEmails && <div className='bg-slate-800 w-full py-2 text-white font-bold text-center'>Chat</div>
            }
            {
                conversations && conversations.map((conversation) => {
                    return <button className={`w-full p-2 text-start ${currentChat?.id === conversation.userInfo.id ? 'bg-green-800' : 'bg-slate-900 hover:bg-slate-700'}`} onClick={() => setCurrentChat(conversation.userInfo)} key={conversation.userInfo.id}>{conversation.userInfo.email}</button>
                })
            }
        </div>
    </div>
}
export default ConversationContainer;