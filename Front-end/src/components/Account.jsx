import React, { useState, useCallback } from "react";
import Navbar from "./Navbar";
import { Heading, Text, Flex, Box, Button, Input, Avatar, useColorModeValue, SlideFade, ScaleFade, useDisclosure, useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import * as UserApi from "../api/user";

export default function Account() {
  const localStorageUsername = localStorage.getItem("username");
  const localStorageEmail = localStorage.getItem("email");

  const profileBackground = useColorModeValue("teal.300", "teal.600");
  const avatarBackground = useColorModeValue("teal.400", "teal.700");
  const inputBackground = useColorModeValue("gray.200", "teal.800");

  const { isOpen, onToggle } = useDisclosure();
  const [username, setUsername] = useState(localStorageUsername);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { register, handleSubmit } = useForm();

  const handleClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  const onSubmit = useCallback(
    async formData => {
      setLoading(true);
      formData.email = localStorageEmail;
      const { username } = await UserApi.updateUser(formData);
      if (username) {
        setTimeout(() => {
          setUsername(username);
          toast({
            title: "Success",
            description: "Updated username successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
          localStorage.setItem("username", username);
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Error trying to update username",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    },
    [toast, localStorageEmail]
  );

  return (
    <>
      <Navbar />
      <Heading as="h1" ml={5} mb={5}>
        Account
      </Heading>
      <ScaleFade initialScale={0.9} in={true}>
        <Flex className="account-container" justify="center">
          <Flex className="account-wrapper" bg={profileBackground} borderRadius="12px" w="60%" h="450px" direction="column">
            <Box mr="auto" ml="auto" mt={5}>
              <Heading data-cy="welcome_heading" as="h2" size="lg">
                Welcome {username}
              </Heading>
            </Box>
            <Box ml={5}>
              <Avatar name={username} bg={avatarBackground} size="lg" mb={4} />
              <Heading as="h3" size="md">
                Your information:
              </Heading>
              <Box mb={5}>
                <Text>Username: {username}</Text>
                <Text>Connected email address: {localStorageEmail}</Text>
              </Box>
              <Button data-cy="change_button" colorScheme="teal" onClick={handleClick}>
                Change username
              </Button>
              <SlideFade in={isOpen} offsetY="20px">
                <Flex direction="column">
                  <Input
                    className="account-input"
                    data-cy="username_input"
                    mt={5}
                    mb={5}
                    w="40%"
                    type="text"
                    placeholder="enter new username"
                    bg={inputBackground}
                    {...register("username")}
                  />

                  <Button
                    className="account-button"
                    data-cy="confirm_button"
                    w="20%"
                    colorScheme="teal"
                    isLoading={loading}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Confirm
                  </Button>
                </Flex>
              </SlideFade>
            </Box>
          </Flex>
        </Flex>
      </ScaleFade>
    </>
  );
}
