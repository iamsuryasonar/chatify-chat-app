import { useState } from 'react';
import { emailPasswordSignIn } from '../services/auth.services';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function LogIn() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: 'test@gmail.com',
        password: '11111111'
    });

    async function signInHandler() {
        await emailPasswordSignIn(input.email, input.password).then((user) => {
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
                    <input id='email' name='email' value={input.email} onChange={handleChange} className='border-[1px] border-slate-300 rounded-md px-2 py-1' type="text" placeholder='eg: johndoe@example.com' />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="password">Password</label>
                    <input id='password' name='password' value={input.password} onChange={handleChange} className='border-[1px] border-slate-300 rounded-md px-2 py-1' type="text" placeholder='eg: jfhNf$53DFdsfj' />
                </div>
                <button onClick={signInHandler} className='px-4 py-1 bg-black text-white shadow-md rounded-md'>Sign in</button>
                <Link to='/sign-up' className='place-self-end'>Don't have an account?</Link>
            </div>
        </div>
    )
}

export default LogIn;