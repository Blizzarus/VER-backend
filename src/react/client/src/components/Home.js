import React, { useState } from 'react';
import { socket } from '../context/socket'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('send-username', userName);
    navigate('/game');
  };
  return (
    <form className="home__container" onSubmit={handleSubmit}>
      <h2 className="home__header">Enter Username: </h2>
      <input
        type="text"
        minLength={2}
        name="username"
        id="username"
        className="username__input"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input type="submit" value="Submit" />
    </form>
  );
};

export default Home;