import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import FirebaseProvider from './provider/FirebaseProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './provider/AuthProvider.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FirebaseProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </FirebaseProvider>
  </React.StrictMode>,
)
