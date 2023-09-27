import './tailwind.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'Montserrat' }}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/dash' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App
