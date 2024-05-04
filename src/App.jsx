import './App.css'
import { githubSignInPopup } from '../services/auth.services';
import { getAuth } from "firebase/auth";

import { useEffect } from 'react';

function App() {
  async function signInHandler() {
    let data = await githubSignInPopup();
  }

  useEffect(() => {
    const auth = getAuth();
    console.log(auth.currentUser)
  })

  return (
    <div>
      <button onClick={signInHandler} className='px-4 py-1 bg-black text-white shadow-md rounded-md'>Sign in with github</button>
    </div>
  )
}

export default App
