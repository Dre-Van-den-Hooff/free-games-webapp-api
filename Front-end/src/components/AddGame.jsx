import React, { useState, useCallback } from "react";
import Navbar from "./Navbar";
import { useForm } from "react-hook-form";
import { Text, Heading, FormControl, FormLabel, Select, Input, Button, Flex, useColorModeValue, useToast, ScaleFade } from "@chakra-ui/react";
import * as GamesAPI from "../api/games";

export default function AddGame() {
  const formBackground = useColorModeValue("teal.200", "gray.700");
  const inputBackground = useColorModeValue("gray.200", "gray.600");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const toast = useToast();

  const onSubmit = useCallback(
    async formData => {
      formData.thumbnail = "";
      setLoading(true);
      try {
        await GamesAPI.postGame(formData);
        setTimeout(() => {
          toast({
            title: "Game added",
            description: "The game was succesfully added to our database.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error(error);
        toast({
          title: "Submission failed",
          description: "Make sure all required fields are filled in.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false);
      }
    },
    [toast]
  );

  return (
    <>
      <Navbar />
      <Heading ml={5} mb={5}>
        Add game to database
      </Heading>
      <ScaleFade initialScale={0.9} in={true}>
        <Flex className="form-wrapper" justifyContent="center" alignItems="center">
          <Flex className="form" w="50%" background={formBackground} borderRadius="12px" p="1em">
            <FormControl as="fieldset">
              <FormControl id="title" isRequired>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input
                  data-cy="title_input"
                  className="input"
                  type="text"
                  variant="filled"
                  placeholder="title"
                  background={inputBackground}
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <Text mb={2} textColor="red">
                    {errors.title.message}
                  </Text>
                )}
              </FormControl>
              <FormControl id="title">
                <FormLabel htmlFor="genre">Genre</FormLabel>
                <Select data-cy="genre_input" placeholder="select genre" mb="1em" background={inputBackground} {...register("genre")}>
                  <option value="MMORPG">MMORPG</option>
                  <option value="MMO">MMO</option>
                  <option value="Shooter">Shooter</option>
                  <option value="Survival game">Survival</option>
                  <option value="Card Game">Card game</option>
                  <option value="Social">Social</option>
                  <option value="MOBA">MOBA</option>
                  <option value="Strategy">Strategy</option>
                  <option value="Fighting">Fighting</option>
                  <option value="Racing">Racing</option>
                  <option value="Sports">Sports</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="ARPG">ARPG</option>
                </Select>
              </FormControl>
              <FormControl id="releasedate">
                <FormLabel htmlFor="releasedate">Release date</FormLabel>
                <Input data-cy="date_input" className="input" type="date" background={inputBackground} {...register("release_date")} />
              </FormControl>
              <FormControl id="developer">
                <FormLabel htmlFor="developer">Developer</FormLabel>
                <Input
                  data-cy="developer_input"
                  className="input"
                  type="text"
                  variant="filled"
                  placeholder="developer"
                  background={inputBackground}
                  {...register("developer")}
                />
              </FormControl>
              <Flex justify="flex-end">
                <Button data-cy="submit_game" colorScheme="teal" isLoading={loading} loadingText="Submitting..." onClick={handleSubmit(onSubmit)}>
                  Submit
                </Button>
              </Flex>
            </FormControl>
          </Flex>
        </Flex>
      </ScaleFade>
    </>
  );
}
