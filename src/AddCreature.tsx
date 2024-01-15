import React, { useState } from 'react';
import { SaveFile, creatureAdd, Personality } from './SaveFile';
import { Notification, Alert } from './Notification';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CreatureNameField from './CreatureNameField';
import creatureData from './json-resources/creature_id.json';
import CreatureTemplate from './json-resources/creature_template.json';
import BasicSelect from './BasicSelect';

interface AddCreatureProps
{
  saveFile: SaveFile | null,
  onDataCallback: (data: SaveFile | null) => void;
}

const CreatureCard: React.FC<AddCreatureProps> = ({ saveFile, onDataCallback }) =>
{
  const [creatureValue, setCreatureValue] = useState('');
  const [personalityValue, setPersonalityValue] = useState<Personality>(Personality.NULL);
  const selectOptions = [
    { label: "⇧Health ⇩Attack", value: Personality.HA },
    { label: "⇧Health ⇩Defense", value: Personality.HD },
    { label: "⇧Health ⇩Intelligence", value: Personality.HI },
    { label: "⇧Health ⇩Speed", value: Personality.HS },
    { label: "⇧Attack ⇩Health", value: Personality.AH },
    { label: "⇧Attack ⇩Defense", value: Personality.AD },
    { label: "⇧Attack ⇩Intelligence", value: Personality.AI },
    { label: "⇧Attack ⇩Speed", value: Personality.AS },
    { label: "⇧Defense ⇩Health", value: Personality.DH },
    { label: "⇧Defense ⇩Attack", value: Personality.DA },
    { label: "⇧Defense ⇩Intelligence", value: Personality.DI },
    { label: "⇧Defense ⇩Speed", value: Personality.DS },
    { label: "⇧Intelligence ⇩Health", value: Personality.IH },
    { label: "⇧Intelligence ⇩Attack", value: Personality.IA },
    { label: "⇧Intelligence ⇩Defense", value: Personality.ID },
    { label: "⇧Intelligence ⇩Speed", value: Personality.IS },
    { label: "⇧Speed ⇩Health", value: Personality.SH },
    { label: "⇧Speed ⇩Attack", value: Personality.SA },
    { label: "⇧Speed ⇩Defense", value: Personality.SD },
    { label: "⇧Speed ⇩Intelligence", value: Personality.SI },
    { label: "None", value: Personality.NULL },
  ];

  const addCreatureClick = () =>
  {
    console.log('addCreatureClick')
    if (saveFile === null)
    {
      Alert('saveFile is null.');
      return;
    }
    if (creatureValue === '')
    {
      Alert('Choose creature name.');
      return;
    }
    if (personalityValue === Personality.NULL)
    {
      Alert('Choose creature personality.');
      return;
    }
    console.log(`personalityValue: ${personalityValue}`)
    const saveFileNew = creatureAdd(
      saveFile,
      creatureData,
      CreatureTemplate,
      creatureValue,
      personalityValue
    );
    onDataCallback(saveFileNew);
    Notification(`Creature "${creatureValue}" was added.`);
  }

  const onAutocompletionSelect = (newValue: string | null) =>
  {
    newValue ? setCreatureValue(newValue) : setCreatureValue('');
  }
  const onPersonalitySelect = (newValue: string) =>
  {
    setPersonalityValue(newValue as Personality);
    console.log('onPersonalitySelect')
    console.log(`personalityValue: ${personalityValue}`);
    console.log(`newValue: ${newValue}`);
  }

  return (
    <Card>
      <CardContent className="addCreature card">
        <h3>Add creature</h3>
        <CreatureNameField onChangeCallback={onAutocompletionSelect} />
        <BasicSelect
          options={selectOptions}
          id='personality-select'
          inputLabel='Personality'
          defaultValue={personalityValue}
          onChangeCallback={onPersonalitySelect}
        />
        <Button variant="outlined" color="primary" onClick={addCreatureClick}>
          Summon creature
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreatureCard;