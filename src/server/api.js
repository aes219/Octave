require('dotenv').config();

module.exports = (type) => {
    return `https://${process.env.SERVICE}/v4/spreadsheets/${process.env.SHEET_ID}/values/${type}!A:Z?key=${process.env.API_KEY}`
}