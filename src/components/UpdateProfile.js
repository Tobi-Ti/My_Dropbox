import React, { useRef, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import CenteredContainer from "./CenteredContainer";
import { Box, Heading, VStack } from "@chakra-ui/react";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        navigate("/user");
      })
      .catch(() => {
        setError("Failed to update account");
      })
      .finally(() => {
        setLoading(false);
      });
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
          p={10}
          borderWidth={1}
          borderRadius="md"
          boxShadow="md"
          bg="white"
          maxW="md"
          w="100%"
        >
          <VStack spacing={4} align="stretch">
            <Heading as="h2" size="lg" textAlign="center" color="blue.600">
              Update Profile
            </Heading>
            {error && <Alert status="error">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="email" className="mb-3">
                <Form.Control
                  className="bg-light text-dark"
                  placeholder="Enter new email"
                  type="email"
                  ref={emailRef}
                  required
                  defaultValue={currentUser.email}
                />
              </Form.Group>
              <Form.Group id="password" className="mb-3">
                <Form.Control
                  className="bg-light text-dark"
                  placeholder="Leave blank to keep the same password"
                  type="password"
                  ref={passwordRef}
                />
              </Form.Group>
              <Form.Group id="password-confirm" className="mb-4">
                <Form.Control
                  className="bg-light text-dark"
                  placeholder="Confirm new password"
                  type="password"
                  ref={passwordConfirmRef}
                />
              </Form.Group>
              <Button
                disabled={loading}
                className="w-100 btn btn-danger shadow-sm"
                type="submit"
              >
                Update
              </Button>
            </Form>
            <div className="text-center mt-3">
              <Link to="/user" className="text-decoration-none text-danger">
                Cancel
              </Link>
            </div>
          </VStack>
        </Box>
      </CenteredContainer>
    </Box>
  );
}
