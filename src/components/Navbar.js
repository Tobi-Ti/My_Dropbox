import React from "react";
import { Box, Flex, Heading, IconButton, Spacer } from "@chakra-ui/react"; 
import { Link } from "react-router-dom";
import { BiLogIn, BiCog } from "react-icons/bi";
import { FaDropbox } from "react-icons/fa";

export default function NavbarComponent() {
  return (
    <Box as="nav" bg="blue.600" p={4}>
      <Flex align="center">
        <Link to="/">
          <Flex align="center" _hover={{ opacity: 0.8 }}> {/* Adding hover effect */}
            <FaDropbox fontSize="2rem" color="white" />
            <Heading as="h1" size="lg" color="white" ml={2}>
              Dropbox
            </Heading>
          </Flex>
        </Link>
        <Spacer />
        <Flex>
          <IconButton
            as={Link}
            to="/user"
            aria-label="User Settings"
            icon={<BiCog fontSize="1.5rem" color="white" />}
            colorScheme="red"
            variant="outline"
            borderColor="white"
            mr={4}
            _hover={{ borderColor: "yellow.400", color: "yellow.400" }} 
          />
          <IconButton
            as={Link}
            to="/login"
            aria-label="Login"
            icon={<BiLogIn fontSize="1.5rem" color="white" />}
            colorScheme="red"
            variant="outline"
            borderColor="white"
            _hover={{ borderColor: "yellow.400", color: "yellow.400" }} 
          />
        </Flex>
      </Flex>
    </Box>
  );
}
