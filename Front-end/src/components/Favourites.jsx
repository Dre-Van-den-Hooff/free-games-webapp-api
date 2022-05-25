import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./Navbar";
import { Heading, Box, Flex, Image, Link, Text, IconButton, Tooltip, ScaleFade, useColorModeValue, useToast } from "@chakra-ui/react";
import { Link as RouteLink } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import * as FavouritesAPI from "../api/favourites";

export default function Favourites() {
  const cardBackground = useColorModeValue("teal.300", "teal.600");
  const [favourites, setFavourites] = useState([]);
  const toast = useToast();

  const getFavourites = useCallback(async () => {
    try {
      const data = await FavouritesAPI.getAllGames();
      setFavourites(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error while fetching favourites.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleClick = useCallback(
    async id => {
      try {
        await FavouritesAPI.deleteGameById(id);
        getFavourites();
        toast({
          title: "Game removed from favourites",
          description: "The game was succesfully removed from the list.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error(error);
        toast({
          title: "Game not removed",
          description: "The game was not removed from favourites list.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    },
    [toast, getFavourites]
  );

  useEffect(() => {
    getFavourites();
  }, [getFavourites]);

  return (
    <>
      <Navbar />
      <Heading ml={5}>Favourites</Heading>
      {favourites.length === 0 && (
        <Flex justify="center" align="center" height="60vh">
          <Text fontSize="4xl">
            The Favorites list is empty...{" "}
            <Link as={RouteLink} to="/home" _hover={{ textDecoration: "none", color: "teal.500" }}>
              Add some games!
            </Link>
          </Text>
        </Flex>
      )}
      <ScaleFade initialScale={0.9} in={true}>
        {favourites.map(item => (
          <Flex className="wishlist-container" key={item.id}>
            <Box className="wishlist-items" background={cardBackground}>
              <Flex className="wishlist-info">
                <Image src={item.thumbnail} />
                <Box className="info-container">
                  <Text data-cy="favourites_title" className="info title">
                    {item.title}
                  </Text>
                  <Text className="info"> Genre: {item.genre} </Text>
                  <Text className="info"> Release date: {item.release_date} </Text>
                  <Text className="info"> Developer: {item.developer} </Text>
                  <Text className="info"> Added by: {item.username} </Text>
                </Box>
              </Flex>
              <Box className="delete-item">
                {localStorage.getItem("username") === item.username && (
                  <Tooltip label="remove from favourites">
                    <IconButton data-cy="favourites_remove_button" icon={<RiDeleteBin5Line />} onClick={() => handleClick(item.id)} />
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Flex>
        ))}
      </ScaleFade>
    </>
  );
}
