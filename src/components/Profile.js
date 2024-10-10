import React, { useState } from "react";
import { Box, Text, Button, Alert, Heading, VStack } from "@chakra-ui/react"; 
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function Profile() {
  const [error] = useState("");
  const { currentUser } = useAuth();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgImage="linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/background1.png')" 
      bgSize="cover" 
      bgPosition="center" 
    >
      <CenteredContainer>
        <Box 
          p={10} 
          borderWidth={1} 
          borderRadius="md" 
          boxShadow="md" 
          bg="white" 
          maxW="md"
          w="100%"
        >
          <Heading as="h2" size="lg" textAlign="center" color="blue.600" mb={4}>
            Profile
          </Heading>
          {error && (
            <Alert status="error" borderRadius="md" mb={4}>
              {error}
            </Alert>
          )}
          <VStack spacing={4} align="flex-start">
            <Text fontWeight="bold" color="gray.800">
              Email:
            </Text>
            <Text color="gray.600">{currentUser.email}</Text>
            <Link to="/update-profile" style={{ width: '100%' }}>
              <Button
                colorScheme="blue"
                width="full"
                size="lg"
                borderRadius="md"
                _hover={{ bg: "blue.600", transform: "scale(1.05)" }} 
              >
                Update Profile
              </Button>
            </Link>
            {/* Button to go back to the home page */}
            <Link to="/" style={{ width: '100%' }}>
              <Button
                colorScheme="teal"
                width="full"
                size="lg"
                borderRadius="md"
                _hover={{ bg: "teal.600", transform: "scale(1.05)" }} 
                mt={4} 
              >
                Go Back to Home
              </Button>
            </Link>
          </VStack>
        </Box>
      </CenteredContainer>
    </Box>
  );
}
