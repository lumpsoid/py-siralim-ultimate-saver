import React, { useState } from 'react';
import { Notification } from "./Notification";
import { SaveFile, decodeFile, encodeFile, isFileEncoded } from "./SaveFile";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicSelect from './BasicSelect';

interface FileUploaderProps {
  saveFile: SaveFile | null,
  onDataCallback: (data: SaveFile | null) => void; // Adjust the type according to your callback requirements
}

const FileUploader: React.FC<FileUploaderProps> = ({ saveFile, onDataCallback }) => {
  const [selectedFile, setSelectedFile] = useState<SaveFile | null>(saveFile);
  const [key, setKey] = useState(0);
  const [saveType, setSaveType] = useState<string>("encoded");

  const saveTypeOptions = [
    {label: "save file", value: "encoded"},
    {label: "text", value: "decoded"},
  ];

  const onSaveTypeSelect = (newValue: string) => {
    setSaveType(newValue);
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files == null) {
      Notification('File is not found.');
      return;
    }
    const namePattern = /.*\.sav.*/;
    const file = event.target.files[0];
    if (file) {     
      // if bigger than 10 Mb
      if (file.size > 10000000) {
        setKey((prevKey) => prevKey + 1);
        Notification('File bigger than 10Mb.');
        return;
      }
      if (!file.name.match(namePattern)) {
        setKey((prevKey) => prevKey + 1);
        Notification('File is not a save file.');
        return;
      }
      // Read the file content
      const fileReader = new FileReader();
      fileReader.onload = function (e) {
        if (fileReader.result && typeof fileReader.result === 'string') {
          const isEncoded = isFileEncoded(fileReader.result);
          const saveFile = new SaveFile(file.name, fileReader.result, fileReader.result);
          let saveFileUpdated;
          if (isEncoded) {
            saveFileUpdated = decodeFile(saveFile);
          } else {
            saveFileUpdated = saveFile;
          }
          setSelectedFile(saveFileUpdated);
          onDataCallback(saveFileUpdated);
        } else {
          console.error('File content is not a string.');
        }
      };
      fileReader.readAsText(file);
    }
  };

  const handleClearFile = () => {
    // Clear the selected file by setting it to null
    setSelectedFile(null);
    onDataCallback(null);
    // Increment the key to force re-render with a new file input
    setKey((prevKey) => prevKey + 1);
  };

  const handleSaveFile = () => {
    if (selectedFile === null) {
      Notification('No file selected for download.');
      return;
    }
    let blob;
    switch (saveType) {
      case "encoded":
        const saveFileOutput = encodeFile(selectedFile);
        blob = new Blob([saveFileOutput.contentNew]);
        break;
      case "decoded":
        blob = new Blob([selectedFile.contentNew]);
        break;
      default:
        throw new Error('Selected invalide save type.')
        break;
    }
    // Create a temporary link element
    const link = document.createElement('a');

    // Create an object URL from the Blob
    const url = URL.createObjectURL(blob);

    // Set the href attribute to the object URL
    link.href = url;

    // Specify the download attribute with the desired file name
    link.download = Date.now().toString() + selectedFile.name;

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link and revoke the object URL
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardContent className='card fileUploader'>
        {selectedFile ? (
          <div>
            <Typography variant="h6">Selected File: {selectedFile.name}</Typography>
            <Button variant="outlined" color="primary" onClick={handleClearFile}>
              Clear File
            </Button>
            <Button variant="outlined" color="primary" onClick={handleSaveFile}>
              Save
            </Button>
          </div>
        ) : (
          <div>
            <Typography variant="h6">Choose save file</Typography>
            <input key={key} type="file" onChange={handleFileChange} />
          </div>
        )}
        <BasicSelect
          options={saveTypeOptions}
          id={'select-save-type'}
          inputLabel={'Save as'}
          defaultValue={saveType}
          onChangeCallback={onSaveTypeSelect}
        />
      </CardContent>
    </Card>
  );
};

export default FileUploader;