import React, { useState, useEffect } from 'react';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
};

const thStyle = {
  backgroundColor: 'rgb(117, 111, 111)',
  padding: '10px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #dddddd',
  padding: '8px',
};

const selectStyle = {
  padding: '8px',
  fontSize: '16px',
  marginTop: '10px',
};

function Organisation() {
  const [logs, setLogs] = useState([]);
  const [selectedIP, setSelectedIP] = useState('All');

  useEffect(() => {
    // Function to fetch logs from the server or load them from a file
    const fetchLogs = async () => {
      // You can replace this with your logic to fetch logs
      // from the server or load them from a file.
      // For simplicity, logs are hardcoded here.
      const response = await fetch('logfile2.log');
      const data = await response.text();

      // Split the logs by line and filter based on the selected IP
      const filteredLogs = data
        .split('\n')
        .filter((line) => {
          if (selectedIP === 'All') {
            return true;
          }
          return line.includes(selectedIP);
        });

      setLogs(filteredLogs);
    };

    fetchLogs();
  }, [selectedIP]);

  return (
    <div className="App">
      <h1>Log Viewer</h1>

      <select style={selectStyle} value={selectedIP} onChange={(e) => setSelectedIP(e.target.value)}>
        <option value="All">Select IP</option>
        <option value="34.135.65.1">34.135.65.1</option>
        <option value="117.250.140.42">117.250.140.42</option>
      </select>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Log</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td style={tdStyle}>{log}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Organisation;
