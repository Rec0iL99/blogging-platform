import { Box } from "@chakra-ui/react";
import React from "react";

export const Wrapper = ({ children, variant = "regular" }) => {
  return (
    <Box
      mx="auto"
      mt={8}
      maxW={variant === "regular" ? "800px" : "400px"}
      w="100%"
    >
      {children}
    </Box>
  );
};
