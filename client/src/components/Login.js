import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Grid, Header, Image, Message } from 'semantic-ui-react'

const Login = ({socket}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isError, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userName === '') {
      setError(true);
    } else {
      socket.emit('send-username', userName);
      sessionStorage.setItem('userName', userName);
      // TODO: require unique?
      navigate('/');
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
      <Form size='large' onSubmit={handleSubmit} error={isError}>
        <Form.Input 
          fluid 
          error={isError}
          icon='user' 
          iconPosition='left' 
          placeholder='Player Name' 
          value={userName} 
          onChange={(e) => { 
            setUserName(e.target.value);
            setError(e.target.value === '' || e.target.value.indexOf('::') > -1);
          }}
        />
        <Message
          error
          header='Invalid User Name'
          content={
            userName === '' ? 'Cannot be blank' : 'Cannot contain "::"'
          }
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