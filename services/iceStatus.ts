import { createService } from '../utils';

export type IceStatus = {
  status: string;
};

export const [useIceStatus, setIceStatus] = createService<IceStatus>({
  status: 'before connected'
});
