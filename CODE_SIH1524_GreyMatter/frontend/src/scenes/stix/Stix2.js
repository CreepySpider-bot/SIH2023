
// --------------------------------------------------------------------
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

const Stix2 = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    console.log("Fetching data...");
    const csvFileUrl = 'https://raw.githubusercontent.com/drb-ra/C2IntelFeeds/master/feeds/domainC2s-30day-filter-abused.csv';
  
    Papa.parse(csvFileUrl, {
      header: true,
      download: true,
      complete: async (result) => {
        console.log('Parsed CSV Data:', result.data);
        setData(result.data);
  
        // Log before the fetch
        console.log("Sending data to server...");
  
        // Send data to the Node.js server
        await fetch('http://localhost:5005/addMaliciousDomain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result.data),
        });
  
        // Log after the fetch
        console.log("Data sent to server.");
      },
    });
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Domain</th>
            <th>IOC</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row['#domain']}</td>
              <td>{row['ioc']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stix2;

