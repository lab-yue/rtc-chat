import { createTelepathyChannel, useTelepathy } from '@lirica/telepathy';
import { User } from './userInfo';
export type UserList = {
  users: Record<string, User>;
};
const { set, telepathy } = createTelepathyChannel<UserList>({ users: {} }, 'Theme');

export const selectUsers = () => useTelepathy(telepathy, (s) => Object.values(s.users));

export const addUser = set((state, u: User) => {
  state.users[u.id] = u;
  return state;
});
