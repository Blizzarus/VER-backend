import React, { useState } from 'react';
import { useImmer } from 'use-immer';
import { Navigate } from 'react-router-dom';
import { Container, Step, Modal, Form, Button, Header, Icon, Accordion } from 'semantic-ui-react'
import Clue from './Clue';

const Game = ({socket}) => {
  // const navigate = useNavigate();
  const [guess, setGuess] = useState('');
  const [gamestate, setGamestate] = useState('waiting');
  const [modalOpen, setOpen] = useState(false);

  const [puzzles, setPuzzleState] = useImmer(
    [
      {
        id: '1',
        title: 'Puzzle 1',
        gamestate: 'puzzle1',
        solved: false
      },
      {
        id: '2',
        title: 'Puzzle 2',
        gamestate: 'puzzle2',
        solved: false
      },
      {
        id: '3',
        title: 'Escape!',
        gamestate: 'escape',
        solved: false
      }
    ]
  );

  const clues = [
    {
      title: 'Clue 1',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas fringilla phasellus faucibus scelerisque eleifend donec. Amet luctus venenatis lectus magna fringilla urna porttitor. Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing. Risus viverra adipiscing at in. Magna ac placerat vestibulum lectus mauris. Suscipit tellus mauris a diam maecenas. Aliquam sem et tortor consequat id porta. Eget mauris pharetra et ultrices neque ornare aenean euismod. Consequat semper viverra nam libero. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Auctor urna nunc id cursus metus aliquam eleifend mi.',
    }, 
    {
      title: 'Clue 2',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas fringilla phasellus faucibus scelerisque eleifend donec. Amet luctus venenatis lectus magna fringilla urna porttitor. Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing. Risus viverra adipiscing at in. Magna ac placerat vestibulum lectus mauris. Suscipit tellus mauris a diam maecenas. Aliquam sem et tortor consequat id porta. Eget mauris pharetra et ultrices neque ornare aenean euismod. Consequat semper viverra nam libero. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Auctor urna nunc id cursus metus aliquam eleifend mi.',
    }, 
    {
      title: 'Clue 3',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas fringilla phasellus faucibus scelerisque eleifend donec. Amet luctus venenatis lectus magna fringilla urna porttitor. Ut sem nulla pharetra diam sit amet nisl suscipit adipiscing. Risus viverra adipiscing at in. Magna ac placerat vestibulum lectus mauris. Suscipit tellus mauris a diam maecenas. Aliquam sem et tortor consequat id porta. Eget mauris pharetra et ultrices neque ornare aenean euismod. Consequat semper viverra nam libero. Faucibus turpis in eu mi bibendum neque egestas congue quisque. Auctor urna nunc id cursus metus aliquam eleifend mi.',
    }
  ];

  const handleSubmit = () => {
    const p = puzzles.findIndex((p) => p.gamestate === gamestate)
    const message = `::${puzzles[p].id}::${guess}`;
    socket.emit('PTSSolve', message);
    // get solution verification
    // if correct
    setPuzzleState((draft) => {
      draft[p].solved = true;
      draft[p].solution = guess;
    });
    setOpen(false);
    if ((p+1) < puzzles.length ) {
      setGamestate(puzzles[p+1].gamestate);
    } else {
      setGamestate('completed');
    }
    // else if incorrect
    // don't close, show message
  };
  
  return (
    sessionStorage.getItem('userName') === null
    ?
      <Navigate to='/login' />
    :
      <Container>
        <Modal
          size='tiny' 
          open={modalOpen}
          onClose={
            () => {
              setOpen(false);
              setGuess('');
            }
          }
        >
          <Modal.Header>
            Solve the Puzzle!
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                fluid
                label='Input Solution'
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick={() =>
                {
                  setOpen(false);
                  setGuess('');
                }
              }
              negative
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              positive
            >
              Submit
            </Button>
          </Modal.Actions>
        </Modal>
        <Step.Group 
          ordered 
          widths={puzzles.length}
          unstackable
        >
          {
            puzzles.map((p,i) => {
              if (gamestate === p.gamestate) {
                return <Step
                  active={true}
                  key={p.id}
                  completed={p.solved}
                  title={p.title}
                  onClick={(e) => setOpen(true)}
                />
              }
              return <Step
                active={false}
                key={p.id}
                completed={p.solved}
                title={p.title}
              />
            })
          }
        </Step.Group>
        <div style={{marginTop: '3rem'}}>
          {
            gamestate === 'completed'
            ? 
              <Header as='h1' icon textAlign='center'>
                <Icon name='trophy' circular/>
                <Header.Content>You Escaped!</Header.Content>
              </Header>
            :
              gamestate === 'waiting'
              ?
              <Header as='h1' icon textAlign='center'>
                <Icon name='circle notched' color='teal' loading/>
                <Header.Content>Waiting for Game to Start</Header.Content>
              </Header>
              :
                <>
                  <Header as='h1' icon textAlign='center'>
                    <Icon name='search' circular/>
                    <Header.Content>Investigate</Header.Content>
                  </Header>
                  <Accordion fluid styled>
                    {
                      clues.map((c,i) =>
                        <Clue key={'clue-' + i} clue={c} index={i} />
                      )
                    }
                  </Accordion>
                </>
          }
        </div>
      </Container>
  )
};

export default Game;