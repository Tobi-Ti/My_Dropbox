import React, { useState } from "react";
import { Box, Flex, SimpleGrid, Spinner, Divider, Heading, IconButton, Tooltip, Input } from "@chakra-ui/react";
import { ArrowBackIcon, SearchIcon } from "@chakra-ui/icons"; 
import { useNavigate } from "react-router-dom";
import { useFolder } from "../../useFolder";
import AddFolderButton from "./Add_Folder";
import AddFileButton from "./Add_File";
import Folder from "./Folder";
import File from "./File";
import FileActions from "./FileActions";
import FolderActions from "./FolderActions";
import Navbar from "../Navbar";
import FolderBreadcrumbs from "./FolderBreadcrumbs";
import { useParams, useLocation } from "react-router-dom";

export default function Dashboard() {
  const { folderId } = useParams();
  const { state } = useLocation();
  const { folder, childFolders = [], childFiles = [] } = useFolder(folderId, state?.folder || null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState(""); 


  const handleBack = () => {
    navigate(-1);
  };


  console.log("Child Folders:", childFolders);
  console.log("Child Files:", childFiles);
  console.log("Search Query:", searchQuery);

  const filteredFolders = childFolders.filter((folder) =>
    folder.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = childFiles.filter((file) =>
    file.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("Filtered Folders:", filteredFolders);
  console.log("Filtered Files:", filteredFiles);

  if (folder === undefined || folder === null) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <>
      <Navbar />
      <Box p={4} bg="gray.50" minHeight="100vh">

        {/* Back Button and Search Bar */}
        
        <Flex align="center" justify="space-between" mb={4}>
          
            <Tooltip label="Go Back" fontSize="md">
              <IconButton
                icon={<ArrowBackIcon />}
                colorScheme="teal"
                variant="outline"
                size={"md"}
                isRound
                onClick={handleBack}
                aria-label="Go back"
               
              />
            </Tooltip>
            <Box mx={500} /> {/* Space between buttons */}
            <Input
              placeholder="Search files and folders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              maxWidth="300px"
            />
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              onClick={() => console.log("Search Clicked")}
              colorScheme="teal"
              variant="solid"
              ml={2}
            />
          

          
        </Flex>

        {/* Folder Breadcrumbs */}
        <Flex align="center" mb={4} justify="space-between">
          {folder && <FolderBreadcrumbs currentFolder={folder} />}
        </Flex>

        {/* Search Bar */}
        <Flex justify="center" mb={4} alignItems="center">
          <AddFileButton currentFolder={folder} />
          <Box mx={10} /> {/* Space between buttons */}
          <Tooltip label="Create a folder" aria-label="Create a folder">
            <AddFolderButton currentFolder={folder} />
          </Tooltip>
        </Flex>

        {/* Folders Section */}
        {filteredFolders.length > 0 && (
          <Box mb={4}>
            <Heading size="lg" mb={2} textAlign="left">Folders</Heading>
            <SimpleGrid columns={[2, null, 4]} spacing={4}>
              {filteredFolders.map((childFolder) => (
                <Box
                  key={childFolder.id}
                  p={3}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  _hover={{ boxShadow: "lg", transition: "0.2s" }}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  maxWidth="100%"
                >
                  <Folder folder={childFolder} />
                  <FolderActions folder={childFolder} />
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {filteredFolders.length > 0 && filteredFiles.length > 0 && <Divider my={4} />}

        {/* Files Section */}
        {filteredFiles.length > 0 && (
          <Box>
            <Heading size="lg" mb={2} textAlign="left">Files</Heading>
            <SimpleGrid columns={[2, null, 4]} spacing={4}>
              {filteredFiles.map((childFile) => (
                <Box
                  key={childFile.id}
                  p={3}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  _hover={{ boxShadow: "lg", transition: "0.2s" }}
                  overflow="hidden"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  maxWidth="100%"
                >
                  <File file={childFile} />
                  <FileActions file={childFile} />
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* No Results Message */}
        {filteredFolders.length === 0 && filteredFiles.length === 0 && searchQuery && (
          <Flex justifyContent="center" alignItems="center" mt={10}>
            <Heading size="md">No results found for "{searchQuery}"</Heading>
          </Flex>
        )}
      </Box>
    </>
  );
}
