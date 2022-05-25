import React from "react";
import { IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { BiSun } from "react-icons/bi";
import { FiMoon } from "react-icons/fi";

export default function ThemeSelector({ background }) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Tooltip label="change theme">
        <IconButton
          aria-label="change colormode"
          icon={colorMode === "light" ? <FiMoon /> : <BiSun />}
          onClick={toggleColorMode}
          background={background}
        />
      </Tooltip>
    </>
  );
}
