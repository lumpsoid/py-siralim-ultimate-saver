import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface BasicSelectProps
{
  options: { label: string; value: string }[],
  id: string,
  inputLabel: string,
  defaultValue: string,
  onChangeCallback: (newValue: string) => void;
}

const BasicSelect: React.FC<BasicSelectProps> = ({ options, id, inputLabel, defaultValue, onChangeCallback }) => {
  const label = id + '-label';
  const [selectValue, setValue] = React.useState(defaultValue);

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
    onChangeCallback(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl margin='dense' fullWidth>
        <InputLabel id={label}>{inputLabel}</InputLabel>
        <Select
          labelId={label}
          id={id}
          value={selectValue}
          label={inputLabel}
          onChange={handleChange}
        > 
        {options.map((element, index) => (
          <MenuItem key={index} value={element.value}>{element.label}</MenuItem>
        ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default BasicSelect