require('dotenv').config()
const { google } = require('googleapis');
const sheets = google.sheets({ version: 'v4' })
const path = require("path") 
const creds = path.join(process.cwd(), 'credentials.json');

module.exports = {
    route: 'users/profiles',
    method: 'POST',
    run: async (req, res) => {
        try {
            const { email, name, bio } = req.body
            const auth = await google.auth.getClient({
                keyFile: creds,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });

            const resource = {
                values: [[email, name, bio, '[]']],
            };
            const spreadsheetId = process.env.SHEET_ID
            const range = 'Profiles!A:E'

            sheets.spreadsheets.values.append({
                auth,
                spreadsheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                resource,
            })

            res.status(200).json({
                status: 200,
                message: "OK",
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({
                status: 500,
                message: "Internal Server Error"
            })
        }
    }
}