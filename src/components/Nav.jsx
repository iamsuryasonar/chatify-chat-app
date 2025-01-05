import React from 'react'
import { logOut } from "../services/auth.services";

function Nav() {

    function handleLogOut() {
        logOut().then((data) => {
            navigate('/sign-in')
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <nav className='w-full h-[50px] px-2 flex justify-between items-center bg-slate-950 text-white' >
            <p>Chatify</p>
            <button className="px-4 py-1 bg-slate-800 text-white rounded-full" onClick={handleLogOut}>Log out</button>
        </nav>
    )
}

export default Nav