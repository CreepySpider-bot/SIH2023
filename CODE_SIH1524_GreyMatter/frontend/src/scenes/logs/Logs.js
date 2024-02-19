// Import necessary libraries and modules
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './LogsTable.css';
import Map from './Map';

const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};
// Define global counter variable
let counter = 0;

// LogsTable component
const LogsTable = ({ logs }) => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  // Function to handle location based on IP
  const handleLocation = (ip, logIndex) => {
    const ipa = ip.split("---")[1].split("'")[1];
    if (ipa) {
      axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=f0f62a4a3b3545848f86e12e66805b03&ip_address=${ipa}`)
        .then(response => {
          setLon(response.data.longitude);
          setLat(response.data.latitude);
          // Open Google Maps in a new window/tab
          window.open(`https://www.google.com/maps?q=${response.data.latitude},${response.data.longitude}`, '_blank');
        })
        .catch(error => {
          console.error("Error fetching location:", error);
        });
    }
  };

  return (
    <div className="logs-table-container">
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Source</th>
            <th>Action</th>
            <th>Details</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{log.timestamp}</td>
              <td>{log.source}</td>
              <td>{log.action}</td>
              {
                log.details && (log.details.includes("Malicious") || log.details.includes("DGA")) ?
                  <td style={{ backgroundColor: "red" }}>{log.details}</td> :
                  <td>{log.details}</td>
              }
              <td>
                {log.details && (log.details.includes("Malicious") || log.details.includes("DGA")) &&
                  <button style={{ backgroundColor: "orange", marginLeft:"50px",padding:"1px 5px 1px 5px" , color:"black" }} onClick={() => handleLocation(log.details, index)}>Get Location</button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Logs component
const Logs = ({ onValueChange, onMalChange }) => {
  const filePath = 'logfile2.log';
  const [logContent, setLogContent] = useState([]);

  useEffect(() => {
    counter = 0
    const fetchLogFile = async () => {
      
      try {
        const response = await fetch(filePath);
        const content = await response.text();
        const logsArray = parseLogData(content);
        setLogContent(logsArray);
        onValueChange(logsArray.length);

      } catch (error) {
        console.error('Error fetching log file:', error);
      }
    };

    fetchLogFile();
  }, [onValueChange]);

  const debouncedOnMalChange = debounce(onMalChange, 1000);
  // Function to parse log data
  const parseLogData = (logText) => {
    return logText.split('\n').map((line) => {
      const [timestamp, source, action, details] = line.split(' - ');
      if (details && (details.includes("Malicious") || details.includes("DGA"))) {
        // Increment the global counter variable
        counter += 1;
        // Call the onMalChange callback with the updated counter value
        debouncedOnMalChange(counter);
      }
      return { timestamp, source, action, details };
    });
  };

  return (
    <div>
      <h1>Log File Content</h1>
      <LogsTable logs={logContent} />
    </div>
  );
};

export default Logs;
