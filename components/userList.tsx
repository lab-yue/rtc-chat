import { styled } from '../global';
import { selectUsers } from '../services';

export function UserList() {
  const users = selectUsers();
  return (
    <List>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} <button onClick={() => call(user.name)}>Ask media</button>
        </li>
      ))}
    </List>
  );
}

const List = styled.ul`
  background-color: ${({ theme }) => theme.color.primary};
`;
