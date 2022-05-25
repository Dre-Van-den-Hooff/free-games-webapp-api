import React, { useCallback, useState, useEffect } from "react";
import { Box, Text, FormLabel, Button, Flex, Heading, Input, useColorModeValue, Link, FormControl, ScaleFade, useToast } from "@chakra-ui/react";
import { Link as RouteLink } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useLogin } from "../contexts/AuthProvider";

export default function Login() {
  const loginBackground = useColorModeValue("gray.100", "gray.700");
  const inputBackground = useColorModeValue("gray.200", "gray.600");

  const [disabled, setDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const history = useHistory();
  const login = useLogin();
  const toast = useToast();

  const onSubmit = useCallback(
    async formData => {
      const success = await login(formData);
      if (success) {
        toast({
          title: "Success",
          description: "login success",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        history.replace("/home");
      } else {
        toast({
          title: "Login failed",
          description: "Password or email is incorrect",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    },
    [history, login, toast]
  );

  const handleChange = useCallback(
    (e, input) => {
      if (input === "email") setEmail(e);
      if (input === "password") setPassword(e);
      if (email && password) setDisabled(false);
    },
    [email, password]
  );

  useEffect(() => {
    if (!email || !password) setDisabled(true);
  }, [setDisabled, password, email]);

  return (
    <ScaleFade initialScale={0.9} in={true}>
      <Flex height="100vh" align="center" justify="center">
        <Flex className="login" background={loginBackground}>
          <Box className="toggles">
            <ThemeSelector background={inputBackground} />
          </Box>
          <Heading className="heading">Log in</Heading>
          <FormControl id="email" isRequired>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              data-cy="email_input"
              className="input input-email"
              placeholder="example@email.com"
              variant="filled"
              type="email"
              background={inputBackground}
              {...register("email", { required: "email is required" })}
              onChange={e => handleChange(e.target.value, "email")}
            />
            {errors.email && (
              <Text mb={2} textColor="red">
                {errors.email.message}
              </Text>
            )}
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              data-cy="password_input"
              className="input input-password"
              placeholder="Password"
              variant="filled"
              type="password"
              background={inputBackground}
              {...register("password", { required: "password is required" })}
              onChange={e => handleChange(e.target.value, "password")}
            />
            {errors.password && (
              <Text mb={2} textColor="red">
                {errors.password.message}
              </Text>
            )}
          </FormControl>
          <Link as={RouteLink} to="/signup" colorScheme="teal" mb={3} align="center" _hover={{ textDecoration: "none", color: "teal.500" }}>
            No account? Sign up here!
          </Link>
          <Button data-cy="login_button" mb="1em" colorScheme="teal" isDisabled={disabled} width="100%" onClick={handleSubmit(onSubmit)}>
            Log in
          </Button>
        </Flex>
      </Flex>
    </ScaleFade>
  );
}
