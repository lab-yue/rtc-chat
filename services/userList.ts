import { createService } from '../utils';
import { User } from './userInfo';
export type UserList = {
  users: Record<string, User>;
};
export const [useUserList, setUserList, selectFromUserList] = createService<UserList>({ users: {} });
export const selectUsers = () => selectFromUserList((state) => Object.values(state.users));
