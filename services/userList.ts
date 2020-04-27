import { createTelepathyChannel, useTelepathy } from '@lirica/telepathy';
import { User } from '@prisma/client';

export type UserList = {
  users: Record<string, User>;
};

const { set, telepathy } = createTelepathyChannel<UserList>({ users: {} }, 'User');

export const selectUsers = () => useTelepathy(telepathy, (s) => Object.values(s.users));

export const addUser = set((state, u: User) => {
  state.users[u.id] = u;
  return state;
});
