import "../styles/globals.css";
import type { AppProps /*, AppContext */ } from "next/app";
import { AppStoreProvider } from "../stores/AppContext";
import "../styles/globals.css";
import {
  // ApolloClient,
  // InMemoryCache,
  // HttpLink,
  ApolloProvider,
} from "@apollo/client";
import { ThemeProvider } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import React from "react";
import Layout from "../components/Layout";
// fullcalendar css
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { useApollo } from "../utils/apollo-client";

function MyApp({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState);
  const router = useRouter();

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  if (
    router.pathname.startsWith("/login") ||
    router.pathname.startsWith("/acc-error")
  ) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }

  return (
    // GraphQL client provider
    <ApolloProvider client={apolloClient}>
      {/* Context API for app data */}
      <AppStoreProvider>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </AppStoreProvider>
    </ApolloProvider>
  );
}

export default MyApp;
