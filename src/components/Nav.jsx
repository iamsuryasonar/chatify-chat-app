import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import firebaseService from '../services/firebase.services';
import LoadingBar from './LoadingBar';
import { useLoading } from '../hooks/useLoading';

function Nav() {

    const navigate = useNavigate();
    const { loading } = useLoading();

    const { currentUser } = useContext(AuthContext);

    async function handleLogOut() {
        await firebaseService.logOut();
        navigate('/sign-in');
    }

    return (
        <>
            <nav className='relative w-full h-[50px] px-2 flex justify-between items-center bg-slate-950 text-white' >
                {loading && <LoadingBar />}
                <p>Chatify</p>
                {currentUser?.uid && <p>{currentUser.email}</p>}
                <button className="px-4 py-1 bg-slate-800 text-white rounded-full" onClick={handleLogOut}>Log out</button>
            </nav>
        </>
    )
}

export default Nav