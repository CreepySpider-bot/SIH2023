import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  TextField,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const Stix = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [malwares, setMalwares] = useState([]);
  const [link, setlink] = useState('');
  const [userid, setuserid] = useState('');
  const [password, setpassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/query');
        const data = await response.json();
        setMalwares(data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange1 = (event) => {
    setlink(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setuserid(event.target.value);
  };

  const handleInputChange3 = (event) => {
    setpassword(event.target.value);
  };

  const handleViewClick = (url) => {
    if (url) {
      window.location.href = url;
    }
    // Handle the case when url is not present, you can add custom behavior here
  };

  const shortenTxId = (txId, maxLength) => {
    if (txId.length > maxLength) {
      return `${txId.substring(0, maxLength)}...`;
    }
    return txId;
  };

  const handleSendData = async () => {
    try {
      const response = await fetch('http://localhost:5001/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link,
          userid,
          password,
        }),
      });

      const data = await response.json();
      setMalwares(data.results);
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <Box m="20px">
    <div>
      <TextField
        label="Connection_URL"
        variant="outlined"
        value={link}
        onChange={handleInputChange1}
      />
      <TextField
        label="User ID"
        variant="outlined"
        value={userid}
        onChange={handleInputChange2}
        
      />
      <TextField
        label="Password"
        variant="outlined"
        value={password}
        onChange={handleInputChange3}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendData}
        style={{
          border:"1px solid grey"
        }}
      >
        Send Data
      </Button>

      {malwares && malwares.map((malware, index) => (
        <Box
          // key={`${transaction.txId}-${i}`}
          display="grid"
          gridTemplateColumns="1fr 4fr 3fr 2fr 1fr 2fr"
          alignItems="center"
          border={`2px solid #302b2b`}
          p="15px"
          textAlign="left"
        >
          <Typography
            color={colors.greenAccent[500]}
            variant="h5"
            fontWeight="600"
            marginLeft="10px"
          >
            {index + 1}
          </Typography>
          <Typography
            color={colors.greenAccent[500]}
            variant="h5"
            fontWeight="600"
            textAlign="center"
          >
            {shortenTxId(malware.id,40)}
          </Typography>
          <Typography color={colors.grey[100]} textAlign="center">
            {malware.external_references[1] &&
              malware.external_references[1].url ? (
              <span>{shortenTxId(malware.external_references[1].url,40)}</span>
            ) : null}
          </Typography>
          <Typography color={colors.grey[100]} textAlign="center">
            {malware.type}
          </Typography>
          <Typography color={colors.grey[100]} textAlign="center">
            {malware.created}
          </Typography>
          <Typography color={colors.grey[100]} textAlign="center">
            <Button
              variant="outlined"
              style={{
                backgroundColor: '#717180',
                fontWeight: '800'
              }}
              onClick={() =>
                handleViewClick(
                  malware.external_references[0]?.url
                )
              }
            >
              View
            </Button>
          </Typography>
        </Box>
      ))}
    </div>
    </Box>
  );
};

export default Stix;
