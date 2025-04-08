import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

function ImageUploadComponent() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Read the API URL from environment variables
  const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
  
  // Callback for handling dropped or selected files
  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: true,
  });

  // Clean up preview URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  // Handle file upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setUploadStatus("No files to upload!");
      return;
    }
    setUploading(true);
    setUploadStatus('');

    const formData = new FormData();
    // Append each file with the same key 'files' for proper model binding
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      // Use the API endpoint from your C# backend, using the API_URL from environment variables
      const response = await fetch(`${API_URL}/CustomObject/UploadImage`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        // API returns an array of URLs corresponding to each file
        const urls = await response.json();
        // Merge file metadata with the returned URLs (assuming same order)
        const uploadedFilesData = files.map((file, index) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          url: urls[index]
        }));
        setUploadStatus("Files uploaded successfully!");
        setUploadedFiles(uploadedFilesData);
        setFiles([]); // Clear selected files after successful upload
      } else {
        setUploadStatus("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Remove a file from the selected list
  const removeFile = (fileToRemove) => {
    setFiles(files => files.filter(file => file !== fileToRemove));
  };

  // Remove a file from the uploaded files listing
  const removeUploadedFile = (fileToRemove) => {
    setUploadedFiles(files => files.filter(file => file !== fileToRemove));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-10 text-center cursor-pointer transition-colors 
          ${isDragActive ? 'bg-gray-100 border-blue-400' : 'bg-gray-50 border-blue-300'}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-lg text-gray-600">Drop the images here...</p>
        ) : (
          <p className="text-lg text-gray-600">
            Drag &amp; drop some images here, or click to select images
          </p>
        )}
      </div>

      {/* Preview Section for Selected Files */}
      {files.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Selected Images</h2>
          <div className="flex flex-wrap gap-4">
            {files.map(file => (
              <div key={file.name} className="relative">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-32 h-32 object-cover rounded-md shadow"
                />
                <button
                  onClick={() => removeFile(file)}
                  className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 shadow"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="mt-6 text-center">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-6 py-2 rounded-md text-white font-semibold transition-colors 
            ${uploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {uploading ? 'Uploading...' : 'Upload Files'}
        </button>
        {uploadStatus && <p className="mt-2 text-sm text-gray-700">{uploadStatus}</p>}
      </div>

      {/* Uploaded Files Listing */}
      {/* {uploadedFiles.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-bold mb-4">Uploaded Files</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-left">File Name</th>
                  <th className="py-2 px-4 border-b text-left">Format</th>
                  <th className="py-2 px-4 border-b text-left">Size (KB)</th>
                  <th className="py-2 px-4 border-b text-left">URL</th>
                  <th className="py-2 px-4 border-b text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map(file => (
                  <tr key={file.name} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{file.name}</td>
                    <td className="py-2 px-4 border-b">
                      {file.type.split('/')[1]?.toUpperCase() || 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">{(file.size / 1024).toFixed(2)}</td>
                    <td className="py-2 px-4 border-b">
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View File
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => removeUploadedFile(file)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default ImageUploadComponent;
