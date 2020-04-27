import styled from '@emotion/styled';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Input, Button } from '../components';
import { setUser } from '../services';
import { useAPI } from '../connection';

export default () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errs, setErrs] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data, error } = await useAPI('/signup', { name, email, password });
    if (error) {
      setErrs(Object.fromEntries(error.map((e) => [e.ref, e.message])));
      return;
    }
    setUser(data);
    router.push('/');
  };

  return (
    <>
      <Title>Sign up</Title>
      <form onSubmit={(e) => handleSignUp(e)}>
        <Input value={name} error={errs['name']} onChange={setName} name="name" />
        <Input value={password} error={errs['password']} onChange={setPassword} name="password" type="password" />
        <Input value={email} error={errs['email']} onChange={setEmail} name="email" />
        <Button>Meow</Button>
      </form>
    </>
  );
};

const Title = styled.h1`
  font-size: 2rem;
`;
