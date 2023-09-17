require("dotenv").config();

const express = require('express')
const chalk = require('chalk')
const app = express()
const port = process.env.PORT || 8000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`${chalk.yellow('[ BACKEND ]')} ${chalk.green(chalk.magenta(`Server listening on port ${port}`))}`)
})

require('./router')(app)