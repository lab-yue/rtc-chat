import { createTelepathyChannel } from '@lirica/telepathy';

export type Theme = {
  color: {
    primary: string;
    secondary: string;
    accent: string;
    paper: string;
  };
};

const { select } = createTelepathyChannel<Theme>(
  {
    color: {
      primary: '#22c7a9',
      secondary: '#2db6a3',
      accent: '#fccf4d',
      paper: '#fef3cc'
    }
  },
  'xxx'
);

export const selectTheme = select((s) => {
  console.log(s);
  return s;
});
