import { createTelepathyChannel } from '@lirica/telepathy';
import { User } from '@prisma/client';

export type Call = { calling: boolean; remote: User | null };
const { select, set } = createTelepathyChannel<Call>(
  {
    calling: false,
    remote: null
  },
  'calling'
);

export const startCall = set((state, payload: User) => {
  if (state.calling) {
    return state;
  }
  console.log(`call ${payload.name}`);
  return {
    calling: true,
    remote: payload
  };
});

export const selectCall = select();
