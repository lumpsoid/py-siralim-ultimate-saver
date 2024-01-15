import React, { useState } from 'react';
import { SaveFile, replaceValuesByKey } from './SaveFile';
import { Notification, Alert } from './Notification';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';


interface DustCardProps
{
  saveFile: SaveFile | null,
  onDataCallback: (data: SaveFile | null) => void;
}

const DustCard: React.FC<DustCardProps> = ({ saveFile, onDataCallback }) =>
{
  const [dustValue, setInputValue] = useState('');

  const addDustClick = () =>
  {
    if (saveFile === null)
    {
      Alert('saveFile is null');
      return;
    }
    if (Number.isNaN(parseInt(dustValue, 10)))
    {
      Alert('New value is not a number.');
      return;
    }
    const saveFileNew = replaceValuesByKey(
      saveFile,
      "DustQuantity",
      dustValue
    );
    onDataCallback(saveFileNew);
    setInputValue('');
    Notification('Dust was added.');
  }

  return (
    <Card>
      <CardContent className="dustAdd card">
        <h3>Add dust</h3>
        <TextField
          type="number"
          inputProps={{min: 0}}
          value={dustValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter dust new value"
        />
        <Button variant="outlined" color="primary" onClick={addDustClick}>
          Add dust
        </Button>
      </CardContent>
    </Card>
  );
};

export default DustCard;