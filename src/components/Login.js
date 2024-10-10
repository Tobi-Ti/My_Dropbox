import React, { useRef, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Alert, Heading, Text, Link as ChakraLink } from "@chakra-ui/react"; 
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      setError("No such account exists");
    }
    setLoading(false);
  }

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
          p={6} 
          borderWidth={1} 
          borderRadius="md" 
          boxShadow="md" 
          bg="white" 
          maxW="md"
          w="100%"
        >
          <Heading as="h2" size="lg" textAlign="center" color="blue.600" mb={4}>
            Log In
          </Heading>
          {error && <Alert status="error" mb={4}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <FormControl id="email" mb={4}>
              <FormLabel>Email</FormLabel>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                ref={emailRef} 
                required 
                focusBorderColor="blue.400" 
                bg="gray.100" 
              />
            </FormControl>
            
            <FormControl id="password" mb={4}>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password" 
                placeholder="Enter your password" 
                ref={passwordRef} 
                required 
                focusBorderColor="red.400" 
                bg="gray.100" 
              />
            </FormControl>

            <Button 
              isLoading={loading} 
              loadingText="Logging in..." 
              colorScheme="blue" 
              variant="solid" 
              width="full" 
              type="submit"
            >
              Log In
            </Button>
          </form>

          <Text textAlign="center" mt={3}>
            <ChakraLink color="blue.600" href="/forgot-password">Forgot Password?</ChakraLink>
          </Text>
          <Text textAlign="center" mt={2} color="gray.600">
            Need an account? <ChakraLink color="blue.600" href="/signup">Sign Up</ChakraLink>
          </Text>
        </Box>
      </CenteredContainer>
    </Box>
  );
}
