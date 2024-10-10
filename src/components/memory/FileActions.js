import React, { useState } from "react";
import {
  Button,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Spinner,
  Box,
  useDisclosure,
  Tooltip,  // Import Tooltip component
} from "@chakra-ui/react";
import { FaDownload, FaShare, FaTrash, FaEye } from "react-icons/fa"; // Icons for actions
import { storage, database } from "../../firebase";

const FileActions = ({ file }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra's modal controls
  const [loading, setLoading] = useState(false);
  const [fileType, setFileType] = useState(null);

  const handleDownload = () => {
    window.open(file.url, "_blank");
    toast({
      title: "Download started.",
      description: `Your download for ${file.name} is starting.`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${file.name}?`);
    if (!confirmDelete) return;

    const fileRef = storage.refFromURL(file.url);
    await fileRef.delete();

    const fileDocs = await database.files.where("url", "==", file.url).get();
    fileDocs.forEach((doc) => doc.ref.delete());

    toast({
      title: "File deleted.",
      description: `${file.name} has been deleted.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(file.url);
    toast({
      title: "Link copied.",
      description: `${file.name} link copied to clipboard!`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePreview = () => {
    setLoading(true);
    const extension = file.name.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      setFileType('image');
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
      setFileType('video');
    } else if (['pdf'].includes(extension)) {
      setFileType('pdf');
    } else {
      setFileType('other');
    }

    onOpen();
    setTimeout(() => setLoading(false), 1000); // Simulating loading delay
  };

  const renderFilePreview = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
        </Box>
      );
    }

    if (fileType === 'image') {
      return <Image src={file.url} alt={file.name} objectFit="contain" w="100%" maxH="500px" />;
    } else if (fileType === 'video') {
      return <video controls src={file.url} style={{ width: "100%", maxHeight: "500px" }} />;
    } else if (fileType === 'pdf') {
      return <iframe src={file.url} title={file.name} style={{ width: "100%", height: "500px" }} />;
    } else {
      return <p>Preview not available for this file type.</p>;
    }
  };

  return (
    <>
      <HStack spacing={2} mt={2} wrap="wrap" justify={"center"}>
        <Tooltip label="Preview" fontSize="md">
          <Button size="sm" leftIcon={<FaEye />} onClick={handlePreview}>
            
          </Button>
        </Tooltip>

        <Tooltip label="Download" fontSize="md">
          <Button size="sm" leftIcon={<FaDownload />} onClick={handleDownload}>
           
          </Button>
        </Tooltip>

        <Tooltip label="Share" fontSize="md">
          <Button size="sm" leftIcon={<FaShare />} onClick={handleShare}>
            
          </Button>
        </Tooltip>

        <Tooltip label="Delete" fontSize="md">
          <Button size="sm" leftIcon={<FaTrash />} colorScheme="red" onClick={handleDelete}>
           
          </Button>
        </Tooltip>
      </HStack>

      {/* Modal for previewing the file */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Preview {file.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {renderFilePreview()}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FileActions;
