import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import Logs from "../logs/Logs";
import { useState } from "react";

const Dashboard = () => {
  const [logsLength,setlogsLength] = useState(null);

  const handleLogsValueChange = (value) => {
    setlogsLength(value);
  };

  const [malLength,setmalLength] = useState(null);
  const handlemalchange = (value) =>{
    setmalLength(value)
  }


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const shortenTxId = (txId, maxLength) => {
    if (txId.length > maxLength) {
      return `${txId.substring(0, maxLength)}...`;
    }
    return txId;
  };
  const getRandomBoolean = () => Math.random() < 0.5;
  const statsData = [
    {
      title: "Malicious Detected",
      subtitle: `${malLength}`,
      progress: "0.75",
      increase: `${Math.floor((malLength/logsLength)*100)}%`,
      icon: <EmailIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />,
    },
    {
      title: "Tunneling Detected",
      subtitle: "3",
      progress: "0.90",
      increase: "+0.2%",
      icon: <PointOfSaleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />,
    },
    {
      title: "Queries Resolved",
      subtitle: `${logsLength}`,
      progress: "0.30",
      increase: "+5%",
      icon: <PersonAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />,
    },
    {
      title: "DGA DETECTED",
      subtitle: "0",
      progress: "0.80",
      increase: "+43%",
      icon: <TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />,
    },
  ];
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Analytics Dashboard" subtitle="DefenceDNS" />

            <Box>
              {/* <Button
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "10px 20px",
                }}
              >
                <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                Download Analytics
              </Button> */}
            </Box>
          </Box>

      {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
        {/* ROW 1 */}
        {statsData.map((stat, index) => (
          <Box
            key={index}
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={stat.title}
              subtitle={stat.subtitle}
              progress={stat.progress}
              increase={stat.increase}
              icon={stat.icon}
            />
          </Box>
        ))}
    </Box>
        <Logs onValueChange={handleLogsValueChange} onMalChange={handlemalchange} />
    </Box>
  );
};

export default Dashboard;
