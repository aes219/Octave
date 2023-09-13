require('dotenv').config();

const api = `https://${process.env.SERVICE}/v4/spreadsheets/${process.env.DATABASE_ID}/values/A:Z?key=${process.env.API_KEY}`

module.exports = api;