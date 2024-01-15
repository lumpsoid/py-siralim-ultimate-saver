import React, { useState } from 'react';
import { Knowledge, SaveFile, addKnowledge } from './SaveFile';
import { Notification, Alert } from './Notification';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CreatureNameField from './CreatureNameField';
import creatureData from './json-resources/creature_id.json';
import BasicSelect from './BasicSelect';

interface KnowledgeCardProps
{
  saveFile: SaveFile | null,
  onDataCallback: (data: SaveFile | null) => void;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ saveFile, onDataCallback }) =>
{
  const [creatureName, setCreatureName] = useState('');
  const [knowledgeValue, setKnowledgeValue] = useState<Knowledge>(Knowledge.S);

  const knowledgeOptions = [
    { label: "S", value: Knowledge.S },
    { label: "A", value: Knowledge.A },
    { label: "B", value: Knowledge.B },
    { label: "C", value: Knowledge.C },
    { label: "D", value: Knowledge.D },
    { label: "E", value: Knowledge.E },
    { label: "F", value: Knowledge.F },
  ]

  const KnowledgeAddClick = () =>
  {
    if (saveFile === null)
    {
      Alert('saveFile is null');
      return;
    }
    if (creatureName === '')
    {
      Alert('Creature name is null');
      return;
    }

    const saveFileNew = addKnowledge(
      saveFile,
      creatureData,
      creatureName,
      knowledgeValue
    );
    onDataCallback(saveFileNew);
    Notification(`Knowledge for "${creatureName}" was added.`);
  }

  const onAutocompletionSelect = (newValue: string | null) =>
  {
    newValue ? setCreatureName(newValue) : setCreatureName('');
  }

  const onKnowledgeSelect = (newValue: string) =>
  {
    setKnowledgeValue(newValue as Knowledge);
  }

  return (
    <Card >
      <CardContent className="knowledgeAdd card">
        <h3>Add knowledge</h3>
        <CreatureNameField onChangeCallback={onAutocompletionSelect} />
        <BasicSelect
          options={knowledgeOptions}
          id={'knowledge-select'}
          inputLabel={'Knowledge'}
          defaultValue={Knowledge.S}
          onChangeCallback={onKnowledgeSelect}
        />
        <Button variant="outlined" color="primary" onClick={KnowledgeAddClick}>
          Add knowledge
        </Button>
      </CardContent>
    </Card>
  );
};

export default KnowledgeCard;