import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from './Nav'

function Layout() {
    return (
        <>
            <Nav />
            <div className='relative gradient_bg w-full m-auto overflow-hidden'>
                <div className='w-full min-h-[calc(100svh-50px)] flex'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout