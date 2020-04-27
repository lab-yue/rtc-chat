import { styled } from '../global';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import type { User } from '@prisma/client';
import { Input, Button } from '.';
import { setUser } from '../services';
import { useAPI } from '../connection';

export function LoginForm() {
  const router = useRouter();
  const [selected, setSelected] = useState(router.pathname === '/signup' ? 0 : 1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errs, setErrs] = useState<Record<string, string>>({});

  const handleSignUp = async () => {
    const { data, error } = await useAPI('/signup', { name, email, password });
    if (error) {
      setErrs(Object.fromEntries(error.map((e) => [e.ref, e.message])));
      return null;
    }
    return data;
  };

  const handleSignIn = async () => {
    const { data, error } = await useAPI('/signin', { email, password });
    if (error) {
      setErrs(Object.fromEntries(error.map((e) => [e.ref, e.message])));
      return null;
    }
    return data;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let user: User | null;
    if (selected == 0) {
      user = await handleSignUp();
    } else {
      user = await handleSignIn();
    }
    if (!user) {
      return;
    }
    setUser(user);
    router.push('/');
  };

  const handleSelect = (which: number) => {
    setSelected(which);
    // TODO: handle route change
    //if (which === 0 && router.pathname !== '/signup') {
    //  router.push('/signup', '/signup', { shallow: true });
    //  return;
    //}
    //if (which === 1 && router.pathname !== '/signin') {
    //  router.push('/signin', '/signin', { shallow: true });
    //  return;
    //}
  };

  return (
    <>
      <TitleWrapper>
        <Title selected={selected == 0} onClick={() => handleSelect(0)}>
          Sign up
        </Title>
        <Title selected={false}> / </Title>
        <Title selected={selected == 1} onClick={() => handleSelect(1)}>
          Sign in
        </Title>
      </TitleWrapper>
      <form onSubmit={handleSubmit}>
        {selected === 0 && <Input value={name} error={errs['name']} onChange={setName} name="name" />}
        <Input value={email} error={errs['email']} onChange={setEmail} name="email" />
        <Input value={password} error={errs['password']} onChange={setPassword} name="password" type="password" />
        <Button>Meow</Button>
      </form>
    </>
  );
}
const Title = styled.span<{ selected: boolean }>`
  transition: 0.3s all ease-in-out;
  font-size: ${({ selected }) => (selected ? '2rem' : '1.5rem')};
  color: ${({ theme, selected }) => (selected ? '#000' : theme.paper)};
  cursor: ${({ selected }) => (selected ? 'default' : 'pointer')};
  &:hover {
    opacity: ${({ selected }) => (selected ? 1 : 0.5)};
  }
`;

const TitleWrapper = styled.h1`
  height: 2.2rem;
  margin-bottom: 3rem;
`;
