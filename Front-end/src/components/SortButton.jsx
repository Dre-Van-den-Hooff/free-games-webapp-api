import React, { useCallback } from "react";
import { useGames, useGamesUpdate } from "../contexts/GamesProvider";
import { Text, Box, Link, Collapse, Button, Divider, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { BiSort } from "react-icons/bi";

export default function SortButton() {
  const { isOpen, onToggle } = useDisclosure();
  const filterBackground = useColorModeValue("teal.300", "teal.600");
  const games = useGames();
  const refreshGames = useGamesUpdate();

  const byTitleAZ = useCallback(() => {
    const sorted = games.sort((a, b) => a.title.localeCompare(b.title));
    refreshGames(sorted);
  }, [games, refreshGames]);

  const byTitleZA = useCallback(() => {
    const sorted = games.sort((a, b) => b.title.localeCompare(a.title));
    refreshGames(sorted);
  }, [games, refreshGames]);

  const byGenre = useCallback(() => {
    const sorted = games.sort((a, b) => a.genre.localeCompare(b.genre));
    refreshGames(sorted);
  }, [games, refreshGames]);

  const byDeveloper = useCallback(() => {
    const sorted = games.sort((a, b) => a.developer.localeCompare(b.developer));
    refreshGames(sorted);
  }, [games, refreshGames]);

  const byDateOldest = useCallback(() => {
    const sorted = games.sort((a, b) => a.release_date.localeCompare(b.release_date));
    refreshGames(sorted);
  }, [games, refreshGames]);

  const byDateNewest = useCallback(() => {
    const sorted = games.sort((a, b) => b.release_date.localeCompare(a.release_date));
    refreshGames(sorted);
  }, [games, refreshGames]);

  return (
    <>
      <Box mb={5}>
        <Button onClick={onToggle} rightIcon={<BiSort />} variant="solid" colorScheme="teal" ml={5}>
          Sort by
        </Button>
        <Collapse in={isOpen} animateOpacity>
          <Box className="filter-box" background={filterBackground}>
            <Text>
              <Link onClick={byTitleAZ}>Title A-Z</Link>
            </Text>
            <Divider />
            <Text>
              <Link onClick={byTitleZA}>Title Z-A</Link>
            </Text>
            <Divider />
            <Text>
              <Link onClick={byGenre}>Genre</Link>
            </Text>
            <Divider />
            <Text>
              <Link onClick={byDeveloper}>Developer</Link>
            </Text>
            <Divider />
            <Text>
              <Link onClick={byDateOldest}>Release date Oldest</Link>
            </Text>
            <Divider />
            <Text>
              <Link onClick={byDateNewest}>Release date Newest</Link>
            </Text>
          </Box>
        </Collapse>
      </Box>
    </>
  );
}
