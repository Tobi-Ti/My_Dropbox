import React from "react";
import Signup from "./components/Signup";
import { AuthProvider } from "./AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./components/ForgotPassword";
import UpdateProfile from "./components/UpdateProfile";
import Dashboard from "./components/memory/Dashboard";
import { ChakraProvider } from "@chakra-ui/react"; // Import ChakraProvider

function App() {
  return (
    <ChakraProvider> {/* Wrap the app with ChakraProvider */}
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/folder/:folderId"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-profile"
              element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;
