import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, query, orderBy, getDocs, doc, setDoc, getDoc, addDoc, serverTimestamp, startAt, endAt, onSnapshot } from "firebase/firestore";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_APP_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

class FirebaseServices {
    constructor() {
        this.db = db;
        this.auth = getAuth(app);
    }

    async writeUserData(userId, email) {

        await setDoc(doc(db, "users", userId), {
            email: email,
        });
    }

    async emailSignUp(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            this.writeUserData(userCredential.user.uid, userCredential.user.email)
            return userCredential.user;
        } catch (error) {
            console.error("Error signing up:", error.message);
            throw error;
        }
    }

    async emailSignIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error) {
            console.error("Error signing in:", error.message);
            throw error;
        }
    }


    async logOut() {
        try {
            await signOut(this.auth);
            return "User signed out successfully!";
        } catch (error) {
            console.error("Error signing out:", error.message);
            throw error;
        }
    }

    async searchUserByEmail(prefix) {
        try {
            const q = query(
                collection(this.db, "users"),
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
                return result;
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error searching users:", error);
            throw error;
        }
    };


    async onMessageSend(message, currentUser, user) {

        if (!currentUser?.uid) return;
        if (!user?.id) return;
        try {
            if (message.trim() !== '') {

                const conversationId = [currentUser?.uid, user.id].sort().join("_");

                const chatSnapshot = await getDoc(doc(this.db, "chats", conversationId));

                if (!chatSnapshot.exists()) {
                    // create conversations of current user
                    await setDoc(doc(this.db, 'users', currentUser?.uid, 'conversations', conversationId), {
                        timestamp: serverTimestamp(),
                        userInfo: {
                            id: user.id,
                            email: user.email,
                        }
                    });

                    // create conversations of another user
                    await setDoc(doc(this.db, 'users', user.id, 'conversations', conversationId), {
                        timestamp: serverTimestamp(),
                        userInfo: {
                            id: currentUser?.uid,
                            email: currentUser?.email,
                        }
                    });
                }

                await addDoc(collection(this.db, "chats", conversationId, 'messages'), {
                    from: currentUser?.uid,
                    to: user.id,
                    message: message.trim(),
                    timestamp: serverTimestamp()
                });

            }
            return user;
        } catch (error) {
            console.error("Error adding conversation: ", error);
            throw error;
        }
    }

    listenToConversations(currentUser, callback) {
        try {
            if (currentUser?.uid) {
                const conversationsRef = collection(this.db, 'users', currentUser.uid, "conversations");
                return onSnapshot(conversationsRef, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    callback(data);
                }, (error) => {
                    console.error("Error in collection listener:", error.message);
                });
            }
        } catch (error) {
            console.error("Error setting up collection listener:", error.message);
            throw error;
        }
    }

    listenToChats(currentUser, conversationId, callback) {
        try {
            if (currentUser?.uid) {
                const messagesRef = collection(this.db, "chats", conversationId, 'messages');
                const q = query(messagesRef, orderBy("timestamp", "desc"));
                return onSnapshot(q, (snapshot) => {
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    callback(data);
                }, (error) => {
                    console.error("Error in collection listener:", error.message);
                });
            }
        } catch (error) {
            console.error("Error setting up collection listener:", error.message);
            throw error;
        }
    }

}

const firebaseService = new FirebaseServices();
export default firebaseService;