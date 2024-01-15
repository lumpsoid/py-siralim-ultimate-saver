import React, { useState } from 'react';
import { SaveFile, replaceValuesByKey } from './SaveFile';
import { Notification, Alert } from './Notification';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


interface MaterialsCardProps
{
  saveFile: SaveFile | null,
  onDataCallback: (data: SaveFile | null) => void;
}

const MaterialsCard: React.FC<MaterialsCardProps> = ({ saveFile, onDataCallback }) =>
{
  const [materialsValue, setInputValue] = useState('');

  const addMaterialsClick = () =>
  {
    if (saveFile === null)
    {
      Alert('saveFile is null');
      return;
    }
    if (Number.isNaN(parseInt(materialsValue, 10)))
    {
      Alert('New value is not a number.');
      return;
    }
    const saveFileNew = replaceValuesByKey(
      saveFile,
      "MaterialQuantity",
      materialsValue
    );
    onDataCallback(saveFileNew);
    setInputValue('');
    Notification('Materials was added.');
  }

  return (
    <Card>
      <CardContent className="materialsAdd card">
        <h3>Add materials</h3>
        <TextField
          type="number"
          inputProps={{min: 0}}
          value={materialsValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter materials new value"
        />
        <Button variant="outlined" color="primary" onClick={addMaterialsClick}>
          Add materials
        </Button>
      </CardContent>
    </Card>
  );
};

export default MaterialsCard;