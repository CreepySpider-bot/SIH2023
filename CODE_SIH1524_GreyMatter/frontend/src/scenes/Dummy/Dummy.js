import React, { useState } from 'react';
import axios from 'axios';

const Dummy = () => {
  const [inputText, setInputText] = useState('');
  const [output, setOutput] = useState([]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {
    const domains = inputText.split('\n').filter((domain) => domain.trim() !== '');

    try {
      const response = await axios.post('http://localhost:5173/classify_batches', {
        domains: domains.map((domain) => ({ domain: domain.replace(/^www\./, '') })),
      });

      const result = response.data;
      setOutput(result);

      // Appending the result to output.json on the server
      const outputResponse = await axios.post('http://localhost:5173/append_to_output', result);

      // Display the server's output in the console (for demonstration purposes)
      console.log('Server Output:', outputResponse.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div>
      <textarea
        placeholder="Enter domain names, one per line (without www)"
        value={inputText}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Submit</button>

      <div>
        <h2>Output:</h2>
        <pre>{JSON.stringify(output, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Dummy;
