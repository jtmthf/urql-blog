import type { NextPage } from "next";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { ReactElement } from "react";
import { withUrql } from "../lib/urql-client";
import "../styles/globals.css";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout): JSX.Element {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <SessionProvider>{getLayout(<Component {...pageProps} />)}</SessionProvider>
  );
}

export default withUrql(App);
