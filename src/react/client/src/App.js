import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { socket } from './context/socket';
import io from 'socket.io-client';
import Login from './components/Login';
import Game from './components/Game';
import './App.css';

const socket = io('http://localhost:4000');
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/login" element={<Login socket={socket} />}></Route>
          <Route path="/" element={<Game socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
