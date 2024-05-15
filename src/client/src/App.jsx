import './styles.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Friends from './pages/Friends';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'Montserrat' }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/friends' element={<Friends />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
