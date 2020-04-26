import { createTelepathyChannel } from '@lirica/telepathy';

export type IceStatus = {
  status: string;
};

const { set, select } = createTelepathyChannel<IceStatus>(
  {
    status: 'before connected'
  },
  'IceStatus'
);

export const setIceStatus = set();
export const selectIceStatus = select();
