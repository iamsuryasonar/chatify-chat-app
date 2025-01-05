import { useState } from 'react';
import ChatContainer from '../components/ChatContainer';
import ConversationContainer from '../components/ConversationContainer';

function Home() {
    const [openChatWith, setOpenChatWith] = useState(null);

    return <>
        <div className="w-full h-[calc(100svh-50px)]">
            <div className="w-full h-full flex flex-col gap-2">
                <div className="flex h-full">
                    <ConversationContainer setOpenChatWith={setOpenChatWith} />
                    <ChatContainer user={openChatWith} />
                </div>
            </div>
        </div>
    </>
}

export default Home;

