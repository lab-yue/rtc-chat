import { createService } from '../utils';

export type IceStatus = {
  status: string;
};

const { select, set } = createService<IceStatus>({
  status: 'before connected'
});

export const setIceStatus = set();
export const selectIceStatus = select();
