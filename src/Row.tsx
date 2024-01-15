import Grid from '@mui/material/Grid';
import React from 'react';

interface ColumnProps {
  cards: any[];
}

const Column: React.FC<ColumnProps> = ({ cards }) => (
  <Grid 
    container 
    spacing={2}
    direction="column"
    justifyContent="center"
    alignItems="center"
    
  >
    {cards.map((CardComponent, index) => (
      <Grid key={index} item>
        {CardComponent}
      </Grid>
    ))}
  </Grid>
);

export default Column;
