import React, { useState, useCallback } from "react";
import { Box, Button, Input, useColorModeValue, ScaleFade } from "@chakra-ui/react";
import { useGamesUpdate } from "../contexts/GamesProvider";
import { BiSearchAlt2 } from "react-icons/bi";
import * as GamesAPI from "../api/games";

export default function SearchButton() {
  const inputBackground = useColorModeValue("gray.200", "teal.800");
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const refreshGames = useGamesUpdate();

  const handleClick = useCallback(() => {
    setIsSearching(!isSearching);
  }, [isSearching]);

  const handleChange = async e => {
    setSearchTerm(e);
    try {
      const data = await GamesAPI.getGameBySearchTerm(searchTerm);
      refreshGames(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Box mb={5}>
        {isSearching ? (
          <ScaleFade initialScale={0.9} in={true}>
            <Box mr={5} className="search-input">
              <Input type="text" variant="outline" placeholder="Search" background={inputBackground} onChange={e => handleChange(e.target.value)} />
            </Box>
          </ScaleFade>
        ) : (
          <Button onClick={handleClick} rightIcon={<BiSearchAlt2 />} variant="solid" colorScheme="teal" mr={5}>
            Search
          </Button>
        )}
      </Box>
    </>
  );
}
