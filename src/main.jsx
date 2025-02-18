import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './provider/AuthProvider.jsx'
import { LoadingProvider } from './hooks/useLoading.jsx'
import { FullLayoutProvider } from './hooks/useFullLayOut';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <FullLayoutProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </FullLayoutProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
