import Home from './pages/Home';
import LogIn from './pages/LogIn';
import { Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import PublicRoute from './components/guards/PublicRoute';
import PrivateRoute from './components/guards/PrivateRoute';
import Hero from './pages/Hero';
import Layout from './components/Layout';

function App() {

  return (
    <>
      <Routes>
        <Route element={
          <Layout />
        }>
          <Route path="/" element={<PublicRoute><Hero /></PublicRoute>}></Route>
          <Route path="/sign-up" element={<PublicRoute><Register /></PublicRoute>}></Route>
          <Route path="/sign-in" element={<PublicRoute><LogIn /></PublicRoute>}></Route>
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>}></Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
