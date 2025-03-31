const { google } = require('googleapis');
const { readFileSync } = require("fs");
const { join } = require("path");

const credsPath = join(process.cwd(), 'credentials.json');
const creds = JSON.parse(readFileSync(credsPath, 'utf8'));

module.exports = {
    route: 'users',
    method: 'GET',
    run: async (req, res) => {
        try {
            const auth = await google.auth.getClient({
                credentials: creds,
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });

            const sheets = google.sheets({ version: 'v4', auth });
            const spreadsheetId = process.env.SHEET_ID;
            const range = 'Accounts!A:Z';

            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range,
            });

            const [headerRow, ...rows] = response.data.values;

            const Data = rows.map(row => {
                const obj = {};
                headerRow.forEach((key, index) => {
                    obj[key] = row[index] || '';
                });
                return obj;
            });

            res.status(200).json({
                status: 200,
                message: 'OK',
                value: Data,
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error',
            });
        }
    },
};