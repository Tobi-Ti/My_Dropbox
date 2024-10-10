import React, { useRef, useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Alert, Heading, Text, Link as ChakraLink } from "@chakra-ui/react"; 
import { useAuth } from "../AuthContext";
import CenteredContainer from "./CenteredContainer";

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <CenteredContainer>
      <Box 
        p={6} 
        borderWidth={1} 
        borderRadius="md" 
        boxShadow="md" 
        bg="white" 
      >
        <Heading as="h2" size="lg" textAlign="center" color="red.600" mb={4}>
          Password Reset
        </Heading>
        {error && <Alert status="error" mb={4}>{error}</Alert>}
        {message && <Alert status="success" mb={4}>{message}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input 
              type="email" 
              placeholder="Enter your email" 
              ref={emailRef} 
              required 
              focusBorderColor="red.400" 
              bg="gray.100" 
            />
          </FormControl>
          
          <Button 
            isLoading={loading} 
            loadingText="Resetting..." 
            colorScheme="red" 
            variant="solid" 
            width="full" 
            type="submit"
          >
            Reset Password
          </Button>
        </form>
        
        <Text textAlign="center" mt={3}>
          <ChakraLink color="red.600" href="/login">Login</ChakraLink>
        </Text>
        <Text textAlign="center" mt={2} color="gray.600">
          Need an account? <ChakraLink color="red.600" href="/signup">Sign Up</ChakraLink>
        </Text>
      </Box>
    </CenteredContainer>
  );
}
