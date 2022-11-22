import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/game" element={<Game/>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
