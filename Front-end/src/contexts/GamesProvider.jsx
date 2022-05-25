import React, { useCallback, useMemo, createContext, useState, useEffect, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import * as GamesAPI from "../api/games";

const GamesContext = createContext();
const UpdateGamesContext = createContext();

export const useGames = () => useContext(GamesContext);
export const useGamesUpdate = () => useContext(UpdateGamesContext);

export function GamesProvider({ children }) {
  const [games, setGames] = useState([]);
  const toast = useToast();

  const refreshGames = useCallback(sorted => {
    setGames([...sorted]);
  }, []);

  const initialLoad = useCallback(async () => {
    try {
      const data = await GamesAPI.getAllGames();
      setGames(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error fetching list of games",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    initialLoad();
  }, [initialLoad]);

  const value = useMemo(() => games, [games]);
  return (
    <GamesContext.Provider value={value}>
      <UpdateGamesContext.Provider value={refreshGames}>{children}</UpdateGamesContext.Provider>
    </GamesContext.Provider>
  );
}
