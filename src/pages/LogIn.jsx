import { githubSignInPopup } from '../services/auth.services';
import { getAuth } from "firebase/auth";

import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

function LogIn() {
    const navigate = useNavigate();

    async function signInHandler() {
        await githubSignInPopup().then((data) => {
            navigate('/')
        });
    }

    // useEffect(() => {
    //     const auth = getAuth();
    //     // console.log(auth.currentUser)
    // })

    return (
        <div className=''>
            <button onClick={signInHandler} className='px-4 py-1 bg-black text-white shadow-md rounded-md'>Sign in with github</button>
        </div>
    )
}

export default LogIn;