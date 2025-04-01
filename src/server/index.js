require("dotenv").config();

const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const http = require("http")
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT || 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', 'true'); 
  next();
};

const server = http.createServer(app);

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

server.listen(port, () => {
  console.log(`${chalk.yellow('[ BACKEND ]')} ${chalk.green(chalk.magenta(`Server listening on port ${port}`))}`);
});

require('./router')(app);
