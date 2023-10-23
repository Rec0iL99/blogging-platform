import React from "react";
import { Wrapper } from "./Wrapper";
import { Box, Flex, Link, Heading } from "@chakra-ui/react";
import NextLink from "next/link";

const Layout = ({ children, variant }) => {
  return (
    <>
      <NextLink href="/">
        <div>BlogPlatform</div>
      </NextLink>
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};

export default Layout;
