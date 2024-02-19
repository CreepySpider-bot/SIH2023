import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Box,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function Tunnel() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:3003/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });


      setResults(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };


  return (
    <Box m='20px'>
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Submit
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Domain Name</TableCell>
              <TableCell>Prediction</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.Query}</TableCell>
                {result.Prediction === 1 ? <TableCell style={{backgroundColor:"red"}}>DGA</TableCell> : <TableCell style={{backgroundColor:"green"}}>Safe</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    </Box>
  );
}

export default Tunnel;