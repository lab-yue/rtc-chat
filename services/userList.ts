import { createService } from '../utils';
import { User } from './userInfo';
export type UserList = {
  users: Record<string, User>;
};
const { set, select } = createService<UserList>({ users: {} });

export const selectUsers = select((s) => Object.values(s.users));

export const addUser = set((state, u: User) => {
  state.users[u.id] = u;
  return state;
});
