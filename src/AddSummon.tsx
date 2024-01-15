import React, { useState } from 'react';
import { SaveFile, addSummon } from './SaveFile';
import {Notification, Alert} from './Notification';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CreatureNameField from './CreatureNameField';
import creatureData from './json-resources/creature_id.json';

interface SummonAddProps {
  saveFile: SaveFile | null,
  onDataCallback: (data: SaveFile | null) => void;
}

const SummonCard: React.FC<SummonAddProps> = ({saveFile, onDataCallback}) => {
  const [inputValue, setInputValue] = useState('');

  const SummonAddClick = () => {
    if (saveFile === null) {
      Alert('saveFile is null');
      return;
    }
    if (inputValue === '') {
      Alert('Summon creature has invalide value');
      return;
    }
    
    let saveFileNew = addSummon(saveFile, creatureData, inputValue);
    onDataCallback(saveFileNew);
    setInputValue('');
    Notification(`Summon for "${inputValue}" was added.`);
  }

  const onAutocompletionSelect = (newValue: string | null) => {
    newValue ? setInputValue(newValue) : setInputValue('');
  }

  return (
    <Card>
      <CardContent className="summonAdd card">
        <h3>Add mana for summon</h3>
        <CreatureNameField onChangeCallback={onAutocompletionSelect} />
        <Button variant="outlined" color="primary" onClick={SummonAddClick}>
          Add mana
        </Button>
      </CardContent>
    </Card>
  );
};

export default SummonCard;