import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function InfoBox({ type, items }) {
  return (
    <Alert variant={type}>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Alert>
  );
}
