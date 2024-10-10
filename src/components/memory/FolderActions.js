import React from "react";
import { Button, HStack, useToast } from "@chakra-ui/react";
import { FaShare, FaTrash, FaEdit } from "react-icons/fa";
import { database } from "../../firebase";

const FolderActions = ({ folder }) => {
  const toast = useToast();

 
  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the folder "${folder.name}"?`);
    if (!confirmDelete) return;


    const folderRef = database.folders.doc(folder.id); 
    await folderRef.delete();

  

    toast({
      title: "Folder deleted.",
      description: `The folder "${folder.name}" has been deleted.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };


  const handleShare = () => {
    const folderLink = `https://my-dropbox-ote-graphix/folder/${folder.id}`; 
    navigator.clipboard.writeText(folderLink);
    toast({
      title: "Link copied.",
      description: `Link to folder "${folder.name}" copied to clipboard!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // Handle folder rename (simple prompt for demonstration)
  const handleRename = async () => {
    const newName = prompt("Enter a new name for the folder:", folder.name);
    if (newName && newName !== folder.name) {
      const folderRef = database.folders.doc(folder.id); // Reference to the folder in Firestore
      await folderRef.update({ name: newName });

      toast({
        title: "Folder renamed.",
        description: `Folder has been renamed to "${newName}".`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <HStack spacing={2} mt={2}>
      <Button size="sm" leftIcon={<FaEdit />} onClick={handleRename}>
        Rename
      </Button>
      <Button size="sm" leftIcon={<FaShare />} onClick={handleShare}>
        Share
      </Button>
      <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>
    </HStack>
  );
};

export default FolderActions;