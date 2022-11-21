import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:6379');

function App() {
  return (
    <div>
      <p>Hello World</p>
    </div>
  );
}

export default App;