import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon } from "@chakra-ui/react"; 
import { FaFolder } from "react-icons/fa"; 

export default function Folder({ folder }) {
  return (
    <Button
      as={Link} 
      to={{
        pathname: `/folder/${folder.id}`,
        state: { folder: folder },
      }}
      variant="outline" 
      colorScheme="red" 
      width="100%" 
      justifyContent="flex-start" 
      display="flex" 
      leftIcon={<Icon as={FaFolder} />} 
      _hover={{ bg: "red.100" }} 
    >
      {folder.name} {/* Display folder name */}
    </Button>
  );
}
