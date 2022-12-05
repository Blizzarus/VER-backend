import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Step, Modal, Form, Button, Header, Icon, Accordion, Image, Message } from 'semantic-ui-react'
import Clue from './Clue';

const Game = ({socket}) => {
  const userName = sessionStorage.getItem('userName');
  const [guess, setGuess] = useState('');
  const [gamestate, setGamestate] = useState('waiting');
  const [modalOpen, setOpen] = useState(false);
  const [solveResult, setSolveResult] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const puzzles = [
    {
      id: '1',
      title: 'Puzzle 1',
      activeGS: 'puzzle1',
      solvedGS: ['puzzle2', 'escape', 'completed']
    },
    {
      id: '2',
      title: 'Puzzle 2',
      activeGS: 'puzzle2',
      solvedGS: ['escape', 'completed']
    },
    {
      id: '3',
      title: 'Escape!',
      activeGS: 'escape',
      solvedGS: ['completed']
    }
  ];

  const clues = [
    {
      title: 'Poster',
      content: <>
        <p>You see a chart of the Dewey Decimal System</p>
        <Image src='/dewey.jpg' id='dewey' fluid aria-details='dewey-det'/>
        <details id='dewey-det'>
          <p><b>000-099</b> Computers, Information, and General Reference</p>
          <p><b>100-199</b> Philosopy and Psychology</p>
          <p><b>200-299</b> Religion</p>
          <p><b>300-399</b> Social Sciences</p>
          <p><b>400-499</b> Language</p>
          <p><b>500-599</b> Science</p>
          <p><b>600-699</b> Technology</p>
          <p><b>700-799</b> Arts and Recreation</p>
          <p><b>800-899</b> Literature</p>
          <p><b>900-999</b> History and Geography</p>
        </details>
      </>
    }, 
    {
      title: 'Desk',
      content: <>
        <p>On the surface of the desk, you find a scribbled note, reading:</p>
        <blockquote>
          <p>500 for the first lock</p>
          <p>800 for the second</p>
        </blockquote>
      </>
    },
    {
      title: 'Bookshelf',
      content: <>
        <p>Most of the books are covered in dust, but it seems to be that three have been opened recently. Which would you like to read?</p>
        <Accordion
          defaultActiveIndex={-1}
          styled
          panels={
            [
              {
                key: 'red-book',
                title: { 
                  content: 'The red book',
                  style: {backgroundColor: 'indianred'}
                },
                content: {
                  content: (<>
                    <figure>
                      <blockquote>
                          <p>It was a bright, cold day in April and the clocks were striking thirteen...</p>
                      </blockquote>
                      <figcaption>—George Orwell, <cite>1984</cite></figcaption>
                    </figure>
                    <p>Something is scribbled in the margin. It says "If only we could turn time backwards..."</p>
                  </>)
                }
              },
              {
                key: 'blue-book',
                title: {
                  content: 'The blue book',
                  style: {backgroundColor: 'lightsteelblue'}
                },
                content: {
                  content: (
                    <figure>
                      <blockquote>
                          <p>We thus obtain the following result: Every description of events in space involves the use of a rigid body to which such events have to be referred. The resulting relationship takes for granted that the laws of Euclidean geometry hold for "distances;" the "distance" being represented physically by means of the convention of two marks on a rigid body.</p>
                      </blockquote>
                      <figcaption>—Albert Einstein, <cite>Relativity: The Special and General Theory</cite></figcaption>
                    </figure>
                  )
                }
              },
              {
                key: 'black-book',
                title: {
                  content: 'The black book',
                  style: {backgroundColor: 'darkgray'}
                },
                content: {
                  content: (
                    <figure>
                      <blockquote>
                          <p>Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, "and what is the use of a book," thought Alice "without pictures or conversations?"</p>
                      </blockquote>
                      <figcaption>—Lewis Carroll, <cite>Alice's Adventures in Wonderland</cite></figcaption>
                    </figure>
                  )
                }
              }
            ]
          }
        />
      </>
    },
    {
      title: 'Clock',
      content: <>
          <p>It appears the clock is broken... None of the hands are moving.</p>
          <Image src='/clock.png' centered title='Clock with secondary 24 hour markings. The hour hand points to 1/13 hours, the minute hand to 15 minutes, and the second hand to 30 seconds.'/>
        </>
    },
    {
      title: 'Cabinet',
      content: 
        (gamestate === 'puzzle1') ?
          <>
            <p>The cabinet is locked by a padlock that opens with a size letter code.</p>
            <p>You see something scratched on the door:</p>
            <blockquote>
              <p>6th word, 2nd letter.</p>
              <p>8th word, 3rd letter.</p>
              <p>12th word, 4th letter.</p>
              <p>17th word, 1st letter.</p>
              <p>8th word, 7th letter.</p>
              <p>10th word, 1st letter.</p>
            </blockquote>
          </>
        :
          (gamestate === 'puzzle2') ?
            <>
              <p>The cabinet is unlocked. Sitting on a shelf inside is a heavy safe.</p>
              <Accordion
                defaultActiveIndex={-1}
                styled
                panels={
                  [
                    {
                      key: 'safe',
                      title: 'Safe',
                      content: 'The safe is locked by a 3-value combination lock.'
                    }
                  ]
                }
              />
            </>
          : 
            <>
              <p>The cabinet is unlocked. Sitting on a shelf inside is a heavy safe.</p>
              <Accordion
                defaultActiveIndex={0}
                styled
                panels={
                  [
                    {
                      key: 'safe',
                      title: 'Safe',
                      content: 'The safe is unlocked. A key sits inside.'
                    }
                  ]
                }
              />
            </>
    }
  ];

  socket.on('request-logged-in-user', () => {
    if (userName) socket.emit('send-username', userName);
  });

  socket.on('updateGameState', (data) => {
    if (gamestate !== data) {
      setGamestate(data);
    }
  });

  const handleSubmit = () => {
    console.log(guess);
    const p = puzzles.findIndex((p) => p.activeGS === gamestate)
    const message = `::${puzzles[p].id}::${guess}`;
    console.log(message);
    socket.emit('solveEvent', message);
    socket.on('solveResult', (data) => {
      console.log(data);
      const res = data.split('::');
      setSolveResult(res);
      if (res[0] === 'VAL') {
        setTimeout(() => {
          setOpen(false);
          setGuess('');
          setSolveResult([]);
          socket.emit('requestGameState')
        } , 2000)
      }
    });
  };

  const handleClueChange = (i) => {
    setActiveIndex(i);
  }
  
  return (
    userName === null
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
              setSolveResult([]);
            }
          }
        > {
            gamestate === 'escape' || gamestate === 'completed' ?
              <>
                <Modal.Header>
                  Escape the Room!
                </Modal.Header>
                <Modal.Content style={{textAlign: 'center'}}>
                  {solveResult.length === 0 ?
                  <Button 
                    onClick={handleSubmit}
                    positive
                    size='massive'
                  >
                    Unlock the Door
                  </Button>
                  :
                  <Message 
                      success
                      header='Hooray!'
                      content={solveResult[1]}
                    />
                  }
                </Modal.Content>
              </>
            :
              <>
                <Modal.Header>
                  Solve the Puzzle!
                </Modal.Header>
                <Modal.Content>
                  <Form
                    error={solveResult[0]==='ERR'}
                    success={solveResult[0]==='VAL'}
                  >
                    <Form.Input
                      fluid
                      label='Input Solution'
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                    />
                    <Message 
                      error
                      header='Incorrect'
                      content={solveResult[1]}
                    />
                    <Message 
                      success
                      header='Correct!'
                      content={solveResult[1]}
                    />
                  </Form>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    onClick={() =>
                      {
                        setOpen(false);
                        setGuess('');
                        setSolveResult([]);
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
              </>
          }
          
        </Modal>
        <Step.Group 
          ordered 
          widths={puzzles.length}
          unstackable
        >
          {
            puzzles.map((p,i) => {
              if (gamestate === p.activeGS) {
                return <Step
                  active={true}
                  key={p.id}
                  completed={false}
                  title={p.title}
                  onClick={(e) => setOpen(true)}
                />
              }
              return <Step
                active={false}
                key={p.id}
                completed={p.solvedGS.indexOf(gamestate) > -1}
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
                        <Clue 
                          key={'clue-' + i} 
                          clue={c} 
                          index={i} 
                          activeIndex={activeIndex}
                          onClueChange={handleClueChange}
                        />
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