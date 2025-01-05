import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { emailPasswordSignUp } from '../services/auth.services';
import { db } from '../utils/firebase';
import { Link } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [input, setInput] = useState('');

    async function writeUserData(userId, email) {

        await setDoc(doc(db, "users", userId), {
            email: email,
        });
    }

    async function signUpHandler() {
        await emailPasswordSignUp(input.email, input.password).then((user) => {
            const { uid, email } = user;
            writeUserData(uid, email);
            navigate('/home')
        });
    }

    const handleChange = (e) => {
        setInput((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }

    return (
        <div className='flex justify-center items-center m-auto'>
            <div className='flex flex-col gap-2 p-4 border-[1px] border-slate-300 rounded-md'>
                <div className='flex flex-col'>
                    <label htmlFor="email">Email</label>
                    <input id='email' name='email' onChange={handleChange} className='border-[1px] border-slate-300 rounded-md px-2 py-1' type="text" placeholder='eg: johndoe@example.com' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="password">Password</label>
                    <input id='password' name='password' onChange={handleChange} className='border-[1px] border-slate-300 rounded-md px-2 py-1' type="text" placeholder='eg: jfhNf$53DFdsfj' />
                </div>
                <button onClick={signUpHandler} className='px-4 py-1 bg-black text-white shadow-md rounded-md'>Sign Up</button>
                <Link to='/sign-in' className='place-self-end'>Already a user?</Link>
            </div>
        </div>
    )
}

export default Register;