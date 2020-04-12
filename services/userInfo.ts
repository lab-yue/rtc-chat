import { createService } from '../utils';

enum UserStatus {
  online = 1,
  offline = 0
}

export type User = {
  id: string;
  name: string;
  status: UserStatus;
};

export const [useUser, setUser, selectFromUser] = createService<User>({
  id: '',
  name: '',
  status: 0
});

export const selectUserName = () => selectFromUser((user) => user.name);
