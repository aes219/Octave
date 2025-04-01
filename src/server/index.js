require("dotenv").config();

const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const http = require("http")
const app = express();
const port = process.env.PORT || 8000;

const cors = require('cors');

const corsOptions = {
  origin: process.env.CLIENT || 'http://localhost:3000',
  methods: 'GET,PUT,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`${chalk.yellow('[ BACKEND ]')} ${chalk.green(chalk.magenta(`Server listening on port ${port}`))}`);
});

require('./router')(app);
