import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import { selectTheme } from '../services';
import { useMemo, FC } from 'react';

export default function Meow({ Component, pageProps }) {
  const memoizedComponent = useMemo(() => <Component {...pageProps} />, []);

  return (
    <>
      <Theme>{memoizedComponent}</Theme>
    </>
  );
}

const Theme: FC = ({ children }) => {
  const theme = selectTheme();
  return (
    <>
      <Global
        styles={css`
          html,
          body {
            margin: 0;
            background: ${theme.color.paper};
          }
          ul {
            list-style: none;
          }
          a {
            display: block;
            color: currentColor;
          }
        `}
      />
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
  );
};
