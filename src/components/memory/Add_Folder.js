import React, { useState, useCallback } from "react"; 
import { useDropzone } from "react-dropzone";
import {
  Button,
  Modal,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  VStack,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { database } from "../../firebase";
import { useAuth } from "../../AuthContext";
import { ROOT_FOLDER } from "../../useFolder";

export default function AddFolderButton({ currentFolder }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState("");
  const { currentUser } = useAuth();
  const toast = useToast(); 

  async function handleSubmit(e) {
    e.preventDefault();
    createFolder(name);
  }

  const createFolder = async (folderName) => {
    if (currentFolder == null) return;

    const path = [...currentFolder.path];
    if (currentFolder !== ROOT_FOLDER) {
      path.push({ name: currentFolder.name, id: currentFolder.id });
    }

    const folderExists = await database.folders
      .where("name", "==", folderName)
      .where("parentId", "==", currentFolder.id)
      .where("userId", "==", currentUser.uid)
      .get();

    if (!folderExists.empty) {
      toast({
        title: "Folder already exists.",
        description: `A folder with the name "${folderName}" already exists in this location.`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    await database.folders.add({
      name: folderName,
      parentId: currentFolder.id,
      userId: currentUser.uid,
      path: path,
      createdAt: database.getCurrentTimestamp(),
    });

    setName(""); 
    onClose(); 
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      createFolder(file.name);
    });
  }, [currentFolder]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true, 
  });

  return (
    <>
      {/* Drag-and-Drop Area with the Add Folder Button Inside */}
      <Box
        {...getRootProps()}
        border="2px dashed #ccc"
        borderRadius="md"
        p={6}
        textAlign="center"
        color={isDragActive ? "green.400" : "gray.400"}
        _hover={{ borderColor: "green.400" }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text>Drop folders here to create them...</Text>
        ) : (
          <Text>Drag & Drop folders here, or click to create folder</Text>
        )}

        {/* Button to Add Folder Manually */}
        <IconButton
          onClick={onOpen}
          colorScheme="teal"
          aria-label="Add Folder"
          icon={<AddIcon />}
          size="lg"
          isRound
          mt={4} 
          _hover={{
            bg: "teal.500",
            transform: "scale(1.1)",  // Slightly enlarges the button on hover
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",  // Adds a shadow effect on hover
          }}
          _active={{
            bg: "teal.600",  // Changes the background color when the button is clicked
          }}
        />
      </Box>

      {/* Modal for Manual Folder Creation */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Folder</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Folder Name</FormLabel>
                  <Input
                    placeholder="Enter folder name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    focusBorderColor="teal.400"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button type="submit" colorScheme="teal">
                Add Folder
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
