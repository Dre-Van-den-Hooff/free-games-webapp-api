import React, { useCallback } from "react";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { FiSettings } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { useLogout } from "../contexts/AuthProvider";
import { useHistory } from "react-router-dom";
import ThemeSelector from "./ThemeSelector";

export default function Settings() {
  const logout = useLogout();
  const history = useHistory();

  const handleLogout = useCallback(() => {
    logout();
    history.replace("/");
  }, [logout, history]);

  return (
    <>
      <Box display="flex" alignItems="center" ml="auto">
        <Popover>
          <PopoverTrigger>
            <Button leftIcon={<FiSettings />}>Settings</Button>
          </PopoverTrigger>
          <PopoverContent mr={5}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Settings</PopoverHeader>
            <PopoverBody>
              <Box>
                <ThemeSelector />
                <Tooltip label="log out">
                  <IconButton icon={<BiLogOut />} ml={2} onClick={handleLogout} />
                </Tooltip>
              </Box>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </>
  );
}
