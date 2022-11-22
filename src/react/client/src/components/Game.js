import React, { useState } from 'react';
import { socket } from '../context/socket';
import { useNavigate } from 'react-router-dom';

const Game = () => {
  const navigate = useNavigate();
  const [guess, setGuess] = useState('');
  const puzzleNumber = '2';

  const handleSubmit = (e) => {
    e.preventDefault();
    const message = "::" + puzzleNumber + "::" + guess;
    socket.emit('PTSSolve',message);
    navigate('/game');
  };

  return (
    <form className="game__container" onSubmit={handleSubmit}>
      <h2 className="game__header">Solve Puzzle: </h2>
      <input 
        type="text"
        minLength={6}
        maxLength={6}
        name="attempt"
        id="attempt"
        className="attempt__input"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <input type="submit" value="Submit" /> 
    </form>
  )
};

export default Game;