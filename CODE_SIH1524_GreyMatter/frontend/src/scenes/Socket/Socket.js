// App.js
import React, { useState } from 'react';
import io from 'socket.io-client';
import './Socket.css';
import { Box } from '@mui/material';

const socket = io('http://localhost:5000');

const Socket = () => {
  const [uniqueQueries, setUniqueQueries] = useState(new Set());
  const [traffic, setTraffic] = useState([]);

  const handleFilterSubmit = () => {
    setUniqueQueries(new Set()); // Reset unique queries
    setTraffic([]);
    socket.emit('disconnected'); // Disconnect from previous traffic
    socket.emit('connected'); // Reconnect to receive filtered traffic

    // Send the filter request to the server
    fetch('http://localhost:5000/filter_traffic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `ip=192.168.1.3`,
    });
  };

  socket.on('update_traffic', (data) => {
    setTraffic((prevTraffic) => {
      const updatedTraffic = [...prevTraffic, data];
      setUniqueQueries((prevQueries) => new Set([...prevQueries, data.query]));
      return updatedTraffic;
    });
  });

  return (
    <Box m='20px'>
    <div>

      <button onClick={handleFilterSubmit}>Start Live DNS Tunneling Detection</button>

      <div className="traffic-container">
        <div className="table">
          <div className="table-header">
            <div className="column">Source IP</div>
            <div className="column">Destination IP</div>
            <div className="column">Query</div>
          </div>
          <div className="table-body">
            {traffic.map((data, index) => (
              <div className="table-row" key={index} style={{ backgroundColor: data.color }}>
                <div className="column">{data.src_ip}</div>
                <div className="column">{data.dst_ip}</div>
                <div className="column">{data.query}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="unique-queries">
        <h3>Unique Queries:</h3>
        <ul>
          {[...uniqueQueries].map((query, index) => (
            <li key={index}>{query}</li>
          ))}
        </ul>
      </div>
    </div>
    </Box>
  );
};

export default Socket;
