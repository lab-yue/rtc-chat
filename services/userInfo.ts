import { User } from '@prisma/client';
import { createTelepathyChannel } from '@lirica/telepathy';

const { set, select } = createTelepathyChannel<User>(null, 'Theme');

export const selectUserName = select((u) => u?.name);
export const setUser = set((_, u: User) => u);
