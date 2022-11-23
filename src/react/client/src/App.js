import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Login from './components/Login';
import Game from './components/Game';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/game" element={<Game/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
