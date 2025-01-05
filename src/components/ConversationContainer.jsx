import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { IoMdSearch } from 'react-icons/io';
import { getFirestore, collection, query, orderBy, startAt, endAt, getDocs, doc, setDoc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";

function ConversationContainer({ setOpenChatWith }) {
    const [conversations, setConversations] = useState();
    const [searchEmail, setSearchEmail] = useState('');
    const [searchedEmails, setSearchedEmails] = useState(null);

    const { currentUser } = useContext(AuthContext);
    const db = getFirestore();

    async function getConversation(currentUser) {
        if (!currentUser.uid) return;

        const querySnapshot = await getDocs(collection(db, "users", currentUser.uid, "conversations"));
        let data = [];

        querySnapshot.forEach((doc) => {
            data.push(doc.data());
        });

        setConversations(data);
    }

    const searchUserByEmail = async (prefix) => {
        try {
            const q = query(
                collection(db, "users"),
                orderBy("email"),
                startAt(prefix),
                endAt(prefix + "\uf8ff")
            );

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                let result = [];
                querySnapshot.forEach((doc) => {
                    result.push({ ...doc.data(), id: doc.id });
                });
                setSearchedEmails(result);
            } else {
                console.log("No similar emails found.");
            }
        } catch (error) {
            console.error("Error searching similar emails: ", error);
        }
    };

    function handleSearch() {
        searchUserByEmail(searchEmail);
    }

    useEffect(() => {
        getConversation(currentUser);
    }, [currentUser.uid])

    return <div className="max-w-[170px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[300px] w-full h-full bg-slate-950 flex flex-col gap-2 overflow-auto text-white">
        <div className="flex flex-col items-start">
            <div className='relative m-2'>
                <input type="text" placeholder='Search' className='w-full pl-2 py-1 border-[1px] border-state-300 pr-[30px] bg-transparent' onChange={(e) => setSearchEmail(e.target.value)} />
                {/* //todo: debounce search call and replace search icon button with clear icon button */}
                <IoMdSearch onClick={handleSearch} size={'30px'} className='cursor-pointer aspect-square p-1 absolute right-[4px] top-1/2 bottom-1/2 -translate-y-1/2 ' />
            </div>
            {
                searchedEmails && searchedEmails.map((conversation) => {
                    return <div className='w-full' key={conversation.id}>
                        <button className='w-full text-start p-2 bg-slate-900 hover:bg-slate-700' onClick={() => setOpenChatWith(conversation)} >{conversation.email}</button>
                    </div>
                })
            }
            {
                searchedEmails && <div className='bg-slate-800 w-full py-2 text-white font-bold text-center'>Chat</div>
            }
            {
                conversations && conversations.map((conversation) => {
                    return <button className='w-full p-2 text-start bg-slate-900 hover:bg-slate-700' onClick={() => setOpenChatWith(conversation.userInfo)} key={conversation.userInfo.id}>{conversation.userInfo.email}</button>
                })
            }
        </div>
    </div>
}
export default ConversationContainer;