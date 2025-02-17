import { useState, useRef, useEffect } from 'react';
import ChatContainer from '../components/ChatContainer';
import ConversationContainer from '../components/ConversationContainer';

function Home() {
    const [currentChat, setCurrentChat] = useState(null);

    const homeRef = useRef();

    useEffect(() => {
        const handleResize = (e) => {
            if (e.target.innerWidth) {
                // setShowTranslate(true);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, [])

    return <>
        <div className="w-full h-[calc(100svh-50px)]">
            <div className="w-full h-full flex flex-col gap-2">
                <div ref={homeRef} className="flex h-full">
                    <ConversationContainer currentChat={currentChat} setCurrentChat={setCurrentChat} />
                    <ChatContainer user={currentChat} />
                </div>
            </div>
        </div>
    </>
}

export default Home;

