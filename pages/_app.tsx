import { Global, css } from '@emotion/core';
import { ThemeProvider } from 'emotion-theming';
import { selectTheme } from '../services';
import { useMemo, FC } from 'react';
import { useRouter } from 'next/router';
export default function Meow({ Component, pageProps }) {
  const router = useRouter();
  const memoizedComponent = useMemo(() => <Component {...pageProps} />, [router.pathname]);

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
          @font-face {
            font-family: 'Baloo Bhaina 2';
            src: url('/BalooBhaina2-Regular.woff2') format('woff2');
          }
          html,
          body {
            margin: 0;
            background: ${theme.primary};
            text-align: center;
            font-family: 'Baloo Bhaina 2';
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
