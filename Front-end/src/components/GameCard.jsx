import React, { useCallback } from "react";
import { Box, Image, Text, IconButton, Tooltip, useColorModeValue, useToast } from "@chakra-ui/react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import * as FavouritesAPI from "../api/favourites";
import { useSession } from "../contexts/AuthProvider";

export default function GameCard({ title, thumbnail, genre, releaseDate, developer }) {
  const cardBackground = useColorModeValue("teal.300", "teal.600");
  const toast = useToast();
  const { isAuthed } = useSession();

  const localStorageUsername = localStorage.getItem("username");

  const handleClick = useCallback(async () => {
    const game = {
      title: title,
      thumbnail: thumbnail,
      genre: genre,
      release_date: releaseDate,
      developer: developer,
      username: localStorageUsername,
    };

    try {
      await FavouritesAPI.postGame(game);
      toast({
        title: "Game added to favourites",
        description: "The game was succesfully added to favourites.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Game was not added to favourites",
        description: "There was an error adding the game to favourites.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [title, thumbnail, genre, releaseDate, developer, toast, localStorageUsername]);

  return (
    <>
      <Box className="cards-wrapper">
        <Box className="cards" background={cardBackground}>
          <Box className="cards-info">
            <Image src={thumbnail} />
            <Box className="info-container">
              <Text data-cy="game_title"> Title: {title} </Text>
              <Text data-cy="game_genre"> Genre: {genre} </Text>
              <Text data-cy="game_date"> Release date: {releaseDate} </Text>
              <Text data-cy="game_developer"> Developer: {developer} </Text>
            </Box>
          </Box>
          {isAuthed && (
            <Box className="wishlist-button">
              <Tooltip label="add to favourites">
                <IconButton data-cy="add_to_favourites_button" icon={<AiOutlinePlusSquare />} onClick={handleClick} />
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
}
