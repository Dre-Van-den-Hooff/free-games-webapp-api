import React from "react";
import { Flex, Box, Heading, Code } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />
      <Flex align="center" height="60vh" justify="center">
        <Box>
          <Heading>404: Page not found {":("}</Heading>
          <Code mt={5} colorScheme="red" fontSize="1.5em">
            Page with url {pathname} was not found
          </Code>
        </Box>
      </Flex>
    </>
  );
}
