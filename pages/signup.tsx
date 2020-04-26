import styled from '@emotion/styled';
import { Input, Button } from '../components';
import { useAPI } from '../connection';
import { useState, FormEvent } from 'react';

export default () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await useAPI('/signup', { name, email, password });
    console.log(data);
  };

  return (
    <>
      <Title>Sign up</Title>
      <form onSubmit={(e) => handleSignUp(e)}>
        <Input onChange={(e) => setName(e.target.value)} name="name" />
        <Input onChange={(e) => setPassword(e.target.value)} name="password" type="password" />
        <Input onChange={(e) => setEmail(e.target.value)} name="email" />
        <Button>Meow</Button>
      </form>
    </>
  );
};

const Title = styled.h1`
  font-size: 2rem;
`;
