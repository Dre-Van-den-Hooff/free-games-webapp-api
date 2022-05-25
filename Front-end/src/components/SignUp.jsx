import React, { useCallback, useState, useEffect } from "react";
import {
  Box,
  FormLabel,
  Button,
  Flex,
  Text,
  Tooltip,
  Heading,
  Input,
  useColorModeValue,
  FormControl,
  IconButton,
  Link,
  ScaleFade,
  useToast,
} from "@chakra-ui/react";
import ThemeSelector from "./ThemeSelector";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BsArrowReturnLeft } from "react-icons/bs";
import { Link as RouteLink } from "react-router-dom";
import * as UserAPI from "../api/user";

export default function SignUp() {
  const loginBackground = useColorModeValue("gray.100", "gray.700");
  const inputBackground = useColorModeValue("gray.200", "gray.600");

  const [disabled, setDisabled] = useState(true);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toast = useToast();

  const onSubmit = useCallback(
    async formData => {
      if (formData.password === formData.confirmpassword) {
        const succes = await UserAPI.register(formData);
        if (succes) {
          toast({
            title: "Success",
            description: "Successfully registered",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          history.replace("/");
        } else {
          toast({
            title: "Register failed",
            description: "Email already registered",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Register failed",
          description: "Password does not match confirmed password",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [toast, history]
  );

  const handleChange = useCallback(
    (e, input) => {
      if (input === "email") setEmail(e);
      if (input === "password") setPassword(e);
      if (input === "confirmPassword") setConfirmPassword(e);
      if (input === "username") setUsername(e);

      if (email && password && confirmPassword && username) setDisabled(false);
    },
    [confirmPassword, password, username, email]
  );

  useEffect(() => {
    if (!email || !password || !confirmPassword || !username) setDisabled(true);
  }, [setDisabled, password, email, confirmPassword, username]);

  return (
    <ScaleFade initialScale={0.9} in={true}>
      <Flex height="100vh" align="center" justify="center">
        <Flex className="login" background={loginBackground}>
          <Box className="toggles">
            <Tooltip label="back">
              <Box className="back">
                <Link as={RouteLink} to={"/"}>
                  <IconButton icon={<BsArrowReturnLeft />} background={inputBackground} />
                </Link>
              </Box>
            </Tooltip>
            <Box className="theme">
              <ThemeSelector background={inputBackground} />
            </Box>
          </Box>

          <Heading className="heading">Sign Up</Heading>
          <FormControl id="username" isRequired>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              className="input"
              placeholder="username"
              variant="filled"
              type="text"
              background={inputBackground}
              {...register("username", { required: "Username is required" })}
              onChange={e => handleChange(e.target.value, "username")}
            />
            {errors.username && (
              <Text mb={2} textColor="red">
                {errors.username.message}
              </Text>
            )}
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              className="input"
              placeholder="example@email.com"
              variant="filled"
              type="email"
              background={inputBackground}
              {...register("email", { required: "Email is required" })}
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
              className="input"
              placeholder="Password"
              variant="filled"
              type="password"
              background={inputBackground}
              {...register("password", { minLength: { value: 8, message: "Password must be at least 8 characters" } })}
              onChange={e => handleChange(e.target.value, "password")}
            />
            {errors.password && (
              <Text mb={2} textColor="red">
                {errors.password.message}
              </Text>
            )}
          </FormControl>
          <FormControl id="confirmpassword" isRequired>
            <FormLabel htmlFor="password">Confirm password</FormLabel>
            <Input
              className="input"
              placeholder="Confirm password"
              variant="filled"
              type="password"
              background={inputBackground}
              {...register("confirmpassword", { required: "confirm password is required" })}
              onChange={e => handleChange(e.target.value, "confirmPassword")}
            />
            {errors.confirmpassword && (
              <Text mb={2} textColor="red">
                {errors.confirmpassword.message}
              </Text>
            )}
          </FormControl>
          <Button className="login-button" colorScheme="teal" isDisabled={disabled} onClick={handleSubmit(onSubmit)}>
            Sign up
          </Button>
        </Flex>
      </Flex>
    </ScaleFade>
  );
}
