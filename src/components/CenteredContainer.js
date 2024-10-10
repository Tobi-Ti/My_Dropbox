import React from "react";
import { Box, Center } from "@chakra-ui/react"; 

export default function CenteredContainer({ children }) {
  return (
    <Center  bg="gray.50"> {/* Centering the content and setting a background color */}
      <Box 
        width="100%" 
        maxWidth="400px" 
        padding="6" 
        boxShadow="md" 
        borderRadius="md" 
        bg="white" 
      >
        {children}
      </Box>
    </Center>
  );
}
