import { createService } from '../utils';

export type Theme = {
  color: {
    primary: string;
    secondary: string;
    accent: string;
    paper: string;
  };
};

const { select } = createService<Theme>({
  color: {
    primary: '#22c7a9',
    secondary: '#2db6a3',
    accent: '#fccf4d',
    paper: '#fef3cc'
  }
});

export const selectTheme = select();
