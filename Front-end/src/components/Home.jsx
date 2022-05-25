import React from "react";
import Navbar from "./Navbar";
import GameCard from "./GameCard";
import SortButton from "./SortButton";
import SearchButton from "./SearchButton";
import { useGames } from "../contexts/GamesProvider";
import { Heading, Box, Flex, ScaleFade } from "@chakra-ui/react";

export default function Home() {
  const games = useGames();

  return (
    <>
      <Navbar />
      <Heading ml={5} mb={5}>
        Home
      </Heading>
      <Flex justify="space-between">
        <SortButton />
        <SearchButton />
      </Flex>
      <ScaleFade initialScale={0.9} in={true}>
        <Box textAlign="center">
          {games.map(game => (
            <GameCard
              key={game.id}
              title={game.title}
              thumbnail={game.thumbnail}
              genre={game.genre}
              releaseDate={game.release_date}
              developer={game.developer}
            />
          ))}
        </Box>
      </ScaleFade>
    </>
  );
}
