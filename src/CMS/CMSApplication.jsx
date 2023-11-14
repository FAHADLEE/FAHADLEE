import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';


function CMSApplication() {
  const [Fields, setFields] = useState([]);
  const [Field, setField] = useState('');
  const [editField, setEditField] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [fieldType, setFieldType] = useState('text');

  const handleFieldTypeChange = (event) => {
    setFieldType(event.target.value);
  };

  const addField = () => {
    if (Field.trim() !== '') {
      if (editField !== null) {
        const updatedFields = [...Fields];
        updatedFields[editField].text = Field; // Update the 'text' property
        updatedFields[editField].type = fieldType; // Update the 'type' property
        setFields(updatedFields);
        setEditField(null);
      } else {
        setFields([...Fields, { text: Field, type: fieldType }]); // Store Field as an object with 'text' and 'type'
      }
      setField('');
      setShowInput(false);
    }
  };

  const editFieldHandler = (index) => {
    const FieldToEdit = Fields[index];
    setField(FieldToEdit.text);
    setFieldType(FieldToEdit.type);
    setEditField(index);
    setShowInput(true);
  };

  const deleteField = (index) => {
    const updatedFields = [...Fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };
  const handelonchange = (e, index) => {
    const updatedFields = [...Fields];
    updatedFields[index] = e.target.value;
    setFields(updatedFields);
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h5" gutterBottom>
          To-Do List
        </Typography>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12}>
            {!showInput && (
              <Button onClick={() => setShowInput(true)} variant="contained" color="primary">
                <AddCircleIcon />
              </Button>
            )}
            {showInput && (
              <div>
                <TextField
                  type={fieldType}
                  label="Field"
                  variant="outlined"
                  fullWidth
                  value={Field}
                  onChange={(e) => setField(e.target.value)}
                />
                <Select
                  value={fieldType}
                  onChange={handleFieldTypeChange}
                  variant="outlined"
                  fullWidth
                >
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="time">Time</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="date">Date</MenuItem>
                  <MenuItem value="password">Password</MenuItem>
                  {/* Add more options as needed */}
                </Select>
                <Button
                  onClick={addField}
                  color="primary"
                  aria-label="Add Field"
                >

                  {editField !== null ? <SaveAsIcon /> : <SaveAsIcon />}
                </Button>
              </div>
            )}
          </Grid>
          {Fields.map((FieldObj, index) => (
            <Grid item xs={12} key={index}>
              <div className="input-field">

                <TextField
                  type={FieldObj.type}
                  name="Field"
                  autoComplete="new-password"
                  label={FieldObj.text}
                  id="standard-size-normal"
                  size="small"
                  onChange={handelonchange}
                />
                {editField === index ? (
                  <IconButton onClick={() => addField()} variant="contained" color="primary">
                    <SystemUpdateAltIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => editFieldHandler(index)} variant="contained" color="primary">
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton onClick={() => deleteField(index)} variant="contained" color="secondary">
                  <DeleteIcon />
                </IconButton >
              </div>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
}

export default CMSApplication;
