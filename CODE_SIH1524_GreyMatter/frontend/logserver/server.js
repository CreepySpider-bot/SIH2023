const express = require('express');
const fs = require('fs');
const app = express();
const port = 3001;

app.get('/readLogFile', (req, res) => {
  const filePath = 'logfile.log';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(data);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
