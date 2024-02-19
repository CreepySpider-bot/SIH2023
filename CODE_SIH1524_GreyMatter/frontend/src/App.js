import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Socket from "./scenes/Socket/Socket";
import Stix from "./scenes/stix/Stix";
import Blacklist from "./scenes/blacklist/Blacklist";
import Tunnel from "./scenes/Tunnel/Tunnel";
import Dummy from "./scenes/Dummy/Dummy";
import Logs from "./scenes/logs/Logs";
import Org from "./scenes/logs/Logs";
import Organisation from "./scenes/Org/Org";
import Stix2 from "./scenes/stix/Stix2";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/iptrack" element={<Socket/>}/>
              <Route path="/stix" element={<Stix2/>}/>
              <Route path="/blacklist" element={<Blacklist/>}/>
              <Route path="/tunnel" element={<Tunnel/>}/>
              <Route path="/dummy" element={<Dummy/>}/>
              <Route path="/logs" element={<Logs/>}/>
              <Route path="/org" element={<Organisation/>}/>
              <Route path="/stix2" element={<Stix2/>}/>
              
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
