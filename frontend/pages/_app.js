import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
