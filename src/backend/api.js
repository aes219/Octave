require('dotenv').config();

module.exports = (type) => {
    return `https://${process.env.SERVICE}/v4/spreadsheets/${process.env.DATABASE_ID}/values/${type}!A:Z?key=${process.env.API_KEY}`
}