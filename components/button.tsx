import { styled } from '../global';

export const Button = styled.button`
  transition: 0.3s all ease-in-out;
  background-color: ${({ theme }) => theme.color.accent};
  font-size: 1.2rem;
  border: 0;
  padding: 5px 20px;
  max-width: 80%;
  cursor: pointer;
  border-radius: 10px;
  border-bottom: 2px solid ${({ theme }) => theme.color.paper};
  &:hover {
    opacity: 0.8;
  }
`;
