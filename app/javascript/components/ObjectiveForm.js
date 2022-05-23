import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function ObjectiveForm({
  objective, onChange, onSubmit, onCancel,
}) {
  console.log('objective', JSON.stringify(objective));
  return (
    <>
      <Form.Control
        name="title"
        defaultValue={objective.attributes.title}
        onChange={onChange}
      />
      <Form.Control
        name="weight"
        defaultValue={objective.attributes.weight}
        onChange={onChange}
      />
      <Button
        variant="secondary"
        onClick={onSubmit}
      >
        Update
      </Button>
      <Button
        variant="secondary"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </>
  );
}
