import { getAuth } from 'firebase/auth';
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../provider/AuthProvider';

function PublicRoute({ children }) {
    const { currentUser } = useContext(AuthContext);

    return currentUser ? <Navigate to="/home" /> : <>{children}</>;
}

export default PublicRoute;