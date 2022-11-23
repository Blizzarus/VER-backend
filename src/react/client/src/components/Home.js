import React, { useState } from 'react';
import { socket } from '../context/socket'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Segment, Grid, Header } from 'semantic-ui-react'

const Home = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isValid, setValid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName === '') {
      setValid(false);
    } else {
      socket.emit('send-username', userName);
      navigate('/game');
    }
  };

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column 
      style={
        {
          minWidth: 300,
          maxWidth: '50%'
        }
      }
    >
      <Header as='h1' content='Join the Game!'/>
      <Form size='large' onSubmit={handleSubmit}>
          <Form.Input 
            fluid 
            error={!isValid}
            icon='user' 
            iconPosition='left' 
            placeholder='Player Name' 
            value={userName} 
            onChange={(e) => { 
              setUserName(e.target.value);
              setValid(e.target.value !== '');
            }}
          />
          <Button 
            color='teal' 
            fluid 
            size='large' 
            type='submit'
          >
            Join
          </Button>
      </Form>
    </Grid.Column>
  </Grid>
  );
};

export default Home;