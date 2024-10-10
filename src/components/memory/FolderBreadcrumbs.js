import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"; 
import { Link } from "react-router-dom";
import { ROOT_FOLDER } from "../../useFolder";

export default function FolderBreadcrumbs({ currentFolder }) {
  let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
  if (currentFolder) path = [...path, ...currentFolder.path];

  return (
    <Breadcrumb
      spacing="8px" 
      className="flex-grow-1" 
    >
      {path.map((folder, index) => (
        <BreadcrumbItem key={folder.id} isCurrentPage={index === path.length - 1}>
          <BreadcrumbLink
            as={Link}
            to={{
              pathname: folder.id ? `/folder/${folder.id}` : "/",
              state: { folder: { ...folder, path: path.slice(1, index) } },
            }}
            maxW="100px" 
            isTruncated 
          >
            {folder.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
      {currentFolder && (
        <BreadcrumbItem isCurrentPage>
          <span
            style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={currentFolder.name} 
          >
            {currentFolder.name}
          </span>
        </BreadcrumbItem>
      )}
    </Breadcrumb>
  );
}
