import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useConversationState = create(
    persist(
        (set) => ({
            isLoading: false,
            conversations: null,

            getConversations: async () => {
                set({ isLoading: true });

                try {
                    // get conversation from firebase
                    set({ isLoading: false, conversations: [4, 5, 6] });
                } catch (error) {
                    set({ authMessage: error.message, isLoggedIn: false, isLoading: false });
                }
            }
        }),
        {
            name: 'chatify',
            storage: createJSONStorage(() => IndexedDB),
        },
    ),
)

export default useConversationState;