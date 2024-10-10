import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Alert,
  Heading,
  VStack,
} from "@chakra-ui/react"; 
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    try {
      setError("");
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      setError("Failed to create an account");
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
            Sign Up
          </Heading>
          {error && (
            <Alert status="error" borderRadius="md" mb={4}>
              {error}
            </Alert>
          )}
          <VStack spacing={4} align="stretch">
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                ref={emailRef}
                variant="flushed"
                color="gray.800"
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                ref={passwordRef}
                variant="flushed"
                color="gray.800"
              />
            </FormControl>
            <FormControl id="password-confirm" isRequired>
              <FormLabel>Password Confirmation</FormLabel>
              <Input
                type="password"
                placeholder="Confirm your password"
                ref={passwordConfirmRef}
                variant="flushed"
                color="gray.800"
              />
            </FormControl>
            <Button
              disabled={loading}
              colorScheme="blue"
              width="full"
              mt={4}
              size="lg"
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </VStack>
          <Box textAlign="center" mt={4} color="gray.600">
            Already have an account?{" "}
            <Link to="/login" color="blue.600" fontWeight="bold">
              Log In
            </Link>
          </Box>
        </Box>
    </CenteredContainer>
    </Box>
    
  );
}
