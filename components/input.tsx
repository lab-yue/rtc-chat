import { styled } from '../global';
import { useState } from 'react';

type InputProps = {
  label?: string;
  type?: string;
  name: string;
  error?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
};

export function Input({ name, label, type, error, onChange }: InputProps) {
  const [focus, setFocus] = useState(false);
  const [text, set] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    set(e.target.value);
    onChange(e);
  };

  return (
    <InputWrapper>
      <InputField
        name={name}
        onChange={handleChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        type={type || 'text'}
        error={!!error}
      />
      <InputLabel focus={focus || !!text} htmlFor={name}>
        {label || name} <InputError>{error}</InputError>
      </InputLabel>
    </InputWrapper>
  );
}

export const InputWrapper = styled.div`
  width: 80%;
  margin: 0 auto 3rem;
  height: 1.6rem;
  font-size: 1.2rem;
  position: relative;
`;

const InputLabel = styled.label<{ focus: boolean }>`
  transition: 0.3s all ease-in-out;
  position: absolute;
  padding: 5px;
  pointer-events: none;
  font-weight: bold;
  left: 0;
  top: 0;
  height: 2rem;
  color: ${(props) => (props.focus ? '#000' : '#555')};
  transform: ${(props) => (props.focus ? 'translateY(-1.4rem)' : '')};
  font-size: ${(props) => (props.focus ? '1rem' : 'inherit')};
  font-weight: ${(props) => (props.focus ? 'bold' : 'inherit')};
`;

const InputError = styled.span`
  padding: 5px;
  pointer-events: none;
  color: #f40000;
  text-shadow: 0 0 4px #fff;
`;

const InputField = styled.input<{ error: boolean }>`
  width: 100%;
  height: 100%;
  font-size: inherit;
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 5px;
  height: 2rem;
  background-color: ${({ theme }) => theme.color.secondary};
  border-radius: 10px;

  &:focus {
    outline: none;
    border-bottom: 2px solid ${({ theme, error }) => (error ? '#f40000' : theme.color.accent)};
  }
`;
