import styled from '@emotion/styled';
import { Input, Button } from '../components';
import { useAPI, ErrorResponse } from '../connection';
import { useState, FormEvent } from 'react';

export default () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errs, setErrs] = useState<Record<string, string>>({});

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await useAPI('/signup', { name, email, password });
    if (error) {
      setErrs(Object.fromEntries(error.map((e) => [e.ref, e.message])));
    }
  };

  return (
    <>
      <Title>Sign up</Title>
      <form onSubmit={(e) => handleSignUp(e)}>
        <Input error={errs['name']} onChange={(e) => setName(e.target.value)} name="name" />
        <Input error={errs['password']} onChange={(e) => setPassword(e.target.value)} name="password" type="password" />
        <Input error={errs['email']} onChange={(e) => setEmail(e.target.value)} name="email" />
        <Button>Meow</Button>
      </form>
    </>
  );
};

const Title = styled.h1`
  font-size: 2rem;
`;
