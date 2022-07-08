var nodemailer = require('nodemailer');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get('http://hun-filter-monitor.essentra.com:82/Machine', (req, res) => {
  console.log(req.body);
});


