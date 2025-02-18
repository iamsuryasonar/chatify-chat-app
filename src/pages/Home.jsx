import { useState, useEffect } from 'react';
import ChatContainer from '../components/ChatContainer';
import ConversationContainer from '../components/ConversationContainer';
import { useFullLayOut } from '../hooks/useFullLayOut';

function Home() {
    const [currentChat, setCurrentChat] = useState(null);
    const { isFullLayout, setIsFullLayout } = useFullLayOut();

    useEffect(() => {
        if (window.innerWidth < 600) {
            setIsFullLayout(true);
        } else {
            setIsFullLayout(false);
        }

        const handleResize = (e) => {
            if (e.target.innerWidth < 600) {
                setIsFullLayout(true);
            } else {
                setIsFullLayout(false);
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
                <div className="flex h-full">
                    {
                        (!currentChat) && isFullLayout && <ConversationContainer user={currentChat} setCurrentChat={setCurrentChat} />
                    }
                    {
                        (currentChat) && isFullLayout && <ChatContainer user={currentChat} setCurrentChat={setCurrentChat} />
                    }

                    {
                        !isFullLayout && <>
                            <ConversationContainer user={currentChat} setCurrentChat={setCurrentChat} />
                            <ChatContainer user={currentChat} setCurrentChat={setCurrentChat} />
                        </>
                    }
                </div>
            </div>
        </div>
    </>
}

export default Home;

