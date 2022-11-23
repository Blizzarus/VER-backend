import React, { useState } from 'react';
import { socket } from '../context/socket'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Image } from 'semantic-ui-react'

const Login = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isValid, setValid] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName === '') {
      setValid(false);
    } else {
      socket.emit('send-username', userName);
      // TODO: require unique?
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
      <Image src='/logo192.png' centered />
      <Header as='h1' color='teal' textAlign='center'>
      Join the Game!
      </Header>
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

export default Login;