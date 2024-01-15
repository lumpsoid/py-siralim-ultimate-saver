import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import creatureIds from './json-resources/creature_id.json';
import { Alert } from './Notification';

type CreatureData = {
  [creatureName: string]: string | null;
};

interface CreatureNameFieldProps
{
  onChangeCallback: (newValue: string) => void;
}

const CreatureNameField: React.FC<CreatureNameFieldProps> = ({ onChangeCallback }) =>
{

  return (
    <Autocomplete
      fullWidth
      className='autocomleteName'
      onChange={(event: any, newValue: string | null) =>
      {
        if (newValue === null)
        {
          Alert('newValue is null.');
          onChangeCallback('');
          return;
        }
        if ((creatureIds as CreatureData)[newValue] === null)
        {
          Alert('Data is missing for this creature.');
          onChangeCallback('');
          return;
        }
        onChangeCallback(newValue);
      }}
      disablePortal
      id="combo-box"
      options={Object.keys(creatureIds)}
      // sx={}
      renderInput={(params) => <TextField {...params} label="Creature's name" />}
    />
  );
};

export default CreatureNameField;
