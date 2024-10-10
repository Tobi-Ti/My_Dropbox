import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import ReactDOM from "react-dom";
import { v4 as uuidV4 } from "uuid";
import { useAuth } from "../../AuthContext";
import { storage, database } from "../../firebase";
import { ROOT_FOLDER } from "../../useFolder";
import {
  Box,
  Button,
  Progress,
  useToast,
  VStack,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";

export default function AddFileButton({ currentFolder }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [fileToHandle, setFileToHandle] = useState(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { currentUser } = useAuth();
  const toast = useToast();
  const cancelRef = useRef();
  const uploadControllers = useRef(new Map());

  function handleUpload(file) {
    const id = uuidV4();
    const uploadName = file.name;

    setUploadingFiles((prevUploadingFiles) => [
      ...prevUploadingFiles,
      { id: id, name: uploadName, progress: 0, error: false },
    ]);

    const filePath =
      currentFolder === ROOT_FOLDER
        ? `${currentFolder.path.join("/")}/${uploadName}`
        : `${currentFolder.path.join("/")}/${currentFolder.name}/${uploadName}`;

    const fileRef = storage.ref(`/files/${currentUser.uid}/${filePath}`);
    const controller = new AbortController();
    uploadControllers.current.set(id, controller);

    fileRef
      .getDownloadURL()
      .then(() => {
        setFileToHandle({ file, id });
        setIsAlertOpen(true);
      })
      .catch((error) => {
        if (error.code === "storage/object-not-found") {
          startFileUpload(fileRef, file, id, uploadName, controller);
        } else {
          toast({
            title: "Error",
            description: `An error occurred while checking the file: ${file.name}`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      });
  }

  function startFileUpload(fileRef, file, id, fileName, controller) {
    const uploadTask = fileRef.put(file, { signal: controller.signal });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        setUploadingFiles((prevUploadingFiles) =>
          prevUploadingFiles.map((uploadFile) => {
            if (uploadFile.id === id) {
              return { ...uploadFile, progress: progress };
            }
            return uploadFile;
          })
        );
      },
      (error) => {
        if (error.code !== "storage/canceled") {
          setUploadingFiles((prevUploadingFiles) =>
            prevUploadingFiles.map((uploadFile) => {
              if (uploadFile.id === id) {
                return { ...uploadFile, error: true };
              }
              return uploadFile;
            })
          );

          toast({
            title: "Upload failed",
            description: `There was an error uploading ${fileName}.`,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      },
      () => {
        setUploadingFiles((prevUploadingFiles) =>
          prevUploadingFiles.filter((uploadFile) => uploadFile.id !== id)
        );

        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          database.files.add({
            url: url,
            name: fileName,
            createdAt: database.getCurrentTimestamp(),
            folderId: currentFolder.id,
            userId: currentUser.uid,
          });

          toast({
            title: "File uploaded",
            description: `${fileName} has been successfully uploaded.`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        });
      }
    );
  }

  const handleFileRename = () => {
    const renamedFile = prompt(
      `Please enter a new name for the file "${fileToHandle.file.name}":`
    );
    if (renamedFile) {
      const newFileRef = storage.ref(`/files/${currentUser.uid}/${currentFolder.path.join("/")}/${currentFolder.name}/${renamedFile}`);
      startFileUpload(newFileRef, fileToHandle.file, fileToHandle.id, renamedFile, uploadControllers.current.get(fileToHandle.id));
    }
    setIsAlertOpen(false);
    uploadControllers.current.delete(fileToHandle.id);
    setUploadingFiles((prevUploadingFiles) =>
      prevUploadingFiles.filter((uploadFile) => uploadFile.id !== fileToHandle.id)
    );
  };

  const handleCancelUpload = () => {
    const controller = uploadControllers.current.get(fileToHandle.id);
    if (controller) {
      controller.abort();
      uploadControllers.current.delete(fileToHandle.id);
    }

    setIsAlertOpen(false);
    setUploadingFiles((prevUploadingFiles) =>
      prevUploadingFiles.filter((uploadFile) => uploadFile.id !== fileToHandle.id)
    );
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => handleUpload(file));
  }, [handleUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <Box
        {...getRootProps()}
        border="2px dashed #ccc"
        borderRadius="md"
        p={7}
        textAlign="center"
        color={isDragActive ? "green.400" : "gray.400"}
        _hover={{ borderColor: "green.400" }}
       
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text>Drop the files here ...</Text>
        ) : (
          <Text>Drag & Drop files here, or click to select files</Text>
        )}
        <Button leftIcon={<FaFileUpload />} colorScheme="blue" mt={4}>
          Browse Files
        </Button>
      </Box>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelUpload}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              File Conflict
            </AlertDialogHeader>
            <AlertDialogBody>
              A file named "{fileToHandle?.file.name}" already exists. Would you like to rename the new file?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelUpload}>
                Cancel
              </Button>
              <Button colorScheme="yellow" onClick={handleFileRename} ml={3}>
                Rename
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      
        {uploadingFiles.length > 0 &&
          ReactDOM.createPortal(
            <Box
              position="fixed" 
              top="85%" 
              left="50%" 
              transform="translate(-50%, -50%)" 
              maxWidth="250px"
              zIndex="modal" 
            >
              <VStack spacing={3}>
                {uploadingFiles.map((file) => (
                  <Box key={file.id} bg="gray.700" color="white" p={4} borderRadius="md">
                    <Text isTruncated>{file.name}</Text>
                    <Progress
                      alignContent={"center"}
                      value={file.error ? 100 : file.progress * 100}
                      size="sm"
                      colorScheme={file.error ? "red" : "green"}
                    />
                    {file.error ? (
                      <Text color="red.300" mt={2}>
                        Error
                      </Text>
                    ) : (
                      <Text mt={2}>{Math.round(file.progress * 100)}%</Text>
                    )}
                  </Box>
                ))}
              </VStack>
            </Box>,
            document.body
          )}
    </>
  );
}
