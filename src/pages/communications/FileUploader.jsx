import { useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = ({ onFilesSelected }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*,application/pdf",
        onDrop: (acceptedFiles) => {
            onFilesSelected(acceptedFiles);
        },
    });

    return (
        <div {...getRootProps()} style={{ border: "1px dashed gray", padding: 20 }}>
            <input {...getInputProps()} />
            <p>Drag & drop files here, or click to select files</p>
        </div>
    );
};

export default FileUploader;
