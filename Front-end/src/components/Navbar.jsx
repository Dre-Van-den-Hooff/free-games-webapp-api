import React, { useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import { ListItem, UnorderedList, Link, Box, useColorModeValue, IconButton, Collapse, useDisclosure } from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import Settings from "./Settings";
import useWindowDimensions from "../hooks/useWindowDimensions";

export default function Navbar() {
  const navBackground = useColorModeValue("gray.200", "gray.700");
  const [open, setOpen] = useState(true);
  let { isOpen, onToggle } = useDisclosure();
  const { width } = useWindowDimensions();

  if (width > 600) isOpen = true;

  const handleClick = () => {
    onToggle();
    setOpen(!open);
  };

  return (
    <>
      <Box className="hamburger-menu">
        <IconButton className="hamburger-menu-icon" icon={open ? <FiMenu /> : <MdOutlineCancel />} onClick={handleClick} background={navBackground} />
      </Box>
      <Collapse in={isOpen} animateOpacity>
        <Box className="nav-container" background={navBackground}>
          <UnorderedList>
            <ListItem>
              <Link as={RouteLink} to="/home">
                Home
              </Link>
            </ListItem>
            <ListItem data-cy="to_favourites">
              <Link as={RouteLink} to="/favourites">
                Favourites
              </Link>
            </ListItem>
            <ListItem data-cy="to_account">
              <Link as={RouteLink} to="/account">
                Account
              </Link>
            </ListItem>
            <ListItem>
              <Link as={RouteLink} to="/addgame">
                Add game
              </Link>
            </ListItem>
            <Settings />
          </UnorderedList>
        </Box>
      </Collapse>
    </>
  );
}
