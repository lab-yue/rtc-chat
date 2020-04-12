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

const { set, select } = createService<User>({
  id: '',
  name: '',
  status: 0
});

export const selectUserName = select((u) => u.name);
export const setUser = set((_, u: User) => u);
