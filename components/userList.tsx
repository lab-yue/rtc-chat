import { styled } from '../global';
import { selectUsers, startCall } from '../services';

export function UserList() {
  const users = selectUsers();
  return (
    <List>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} <button onClick={() => startCall(user)}>Ask media</button>
        </li>
      ))}
    </List>
  );
}

const List = styled.ul`
  background-color: ${({ theme }) => theme.primary};
`;
