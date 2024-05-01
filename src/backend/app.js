require("dotenv").config();

const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const http = require('http'); 
const socketIo = require('socket.io'); 
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "http://localhost:3010");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true'); 
  next();
};

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(__dirname + '/node_modules/socket.io/client-dist/socket.io.js');
});

const server = http.createServer(app); 
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3010", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true 
  }
});

io.on('connection', (socket) => {
  socket.on('newMessage', (data) => {
    io.emit('message', data);
  });
});

server.listen(port, () => {
  console.log(`${chalk.yellow('[ BACKEND ]')} ${chalk.green(chalk.magenta(`Server listening on port ${port}`))}`);
});

require('./router')(app);
