import { useState, memo } from 'react';
import { styled } from '../global';

type InputProps = {
  value: string;
  label?: string;
  type?: string;
  name: string;
  error?: string;
  onChange?(value: string): void;
};

export function InputBase({ value, name, label, type, error, onChange }: InputProps) {
  const [focus, setFocus] = useState(false);

  return (
    <InputWrapper>
      <InputField
        name={name}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        type={type || 'text'}
        error={!!error}
        value={value}
        autoComplete="off"
      />
      <InputLabel focus={focus || !!value} htmlFor={name}>
        {label || name} <InputError>{error}</InputError>
      </InputLabel>
    </InputWrapper>
  );
}
export const Input = memo(InputBase);

export const InputWrapper = styled.div`
  width: 80%;
  margin: 0 auto 3rem;
  height: 1.6rem;
  font-size: 1.2rem;
  position: relative;
`;

const InputLabel = memo(styled.label<{ focus: boolean }>`
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
`);

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
  background-color: ${({ theme }) => theme.secondary};
  border-radius: 10px;

  &:focus {
    outline: none;
    border-bottom: 2px solid ${({ theme, error }) => (error ? '#f40000' : theme.accent)};
  }
`;
