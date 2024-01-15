import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const Column: React.FC<ColumnProps> = ({ cards }) => (
  <div className="column">
    {cards.map((card: any, index: number) => (
      <Card key={index} style={{ maxWidth: 400, margin: 'auto' }}>
        <CardContent>
          {card}
        </CardContent>
      </Card>
    ))}
  </div>
);

interface ColumnProps {
  cards: any[];
}

export default Column;
