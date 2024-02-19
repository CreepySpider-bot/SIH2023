import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

const Blacklist = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const filePath = 'blacklist.txt';

  useEffect(() => {
    const fetchBlacklist = async () => {
      try {
        const response = await fetch(filePath);
        const content = await response.text();
        const lines = content.split('\n').slice(0, 500);
        setDomains(lines);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching log file:', error);
        setLoading(false);
      }
    };

    fetchBlacklist();
  }, []);

  return (
    <Box m="20px">
    <div>
      <h1>Top 500 Malicious domains</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Domain</th>
            </tr>
          </thead>
          <tbody style={{ overflowY: 'auto', height: '400px' }}>
            {domains.map((domain, index) => (
              <tr key={index}>
                <td>{domain}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </Box>
  );
};

export default Blacklist;
