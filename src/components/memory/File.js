import React from "react";
import { Link } from "@chakra-ui/react"; 
import { AttachmentIcon } from "@chakra-ui/icons"; 

export default function File({ file }) {
  return (
    <Link
      href={file.url}
      isExternal // This opens the link in a new tab
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={3}
      border="1px"
      borderColor="red.500"
      borderRadius="md"
      _hover={{ bg: "red.100" }} 
      textDecoration="none"
      color="red.500"
      fontWeight="bold"
    >
      <AttachmentIcon boxSize={5} mr={2} /> 
      {file.name}
    </Link>
  );
}
